import axios from "axios";
import { PDFParse } from "pdf-parse";
import { askAi } from "../services/openRouter.service.js";

/** Max characters sent to the AI (keeps token usage reasonable). */
const MAX_RESUME_CHARS = 14_000;

/** Default match % when a job listing has no data at all. */
const DEFAULT_MATCH = 30;

const RESUME_ANALYSIS_SYSTEM = `You analyze resumes for job matching.

Analyze the resume text and extract:
1. Technical skills (programming languages, frameworks, tools, databases — as short strings)
2. One suitable job role title the candidate should search for (e.g. "Frontend Developer", "Data Analyst")

Return JSON only, no markdown, no code fences:
{
  "skills": [],
  "role": ""
}`;

/**
 * Strip markdown code fences and parse JSON from AI output.
 */
function parseAiJson(content) {
  let text = (content || "").trim();
  if (text.startsWith("```")) {
    const firstBreak = text.indexOf("\n");
    text = text.slice(firstBreak + 1);
    const end = text.lastIndexOf("```");
    if (end !== -1) text = text.slice(0, end);
  }
  return JSON.parse(text.trim());
}

/**
 * Normalize a skill string for loose matching.
 * Now strips specific punctuation and handles common variations.
 */
function norm(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\+]/g, " ") // Keep alphanumeric and '+', replace everything else with space
    .replace(/\s+/g, " ");
}

/**
 * Match score: how many job-required skills appear in the resume skill list.
 * Fallback: if no explicit job skills, check how many resume skills are in the description.
 */
function computeMatchPercent(resumeSkills, jobSkills, jobDescription, title = "this role") {
  const resume = (resumeSkills || []).map(norm).filter(Boolean);
  const rawDesc = (jobDescription || "").toLowerCase();
  const normDesc = norm(jobDescription);

  if (resume.length === 0) return DEFAULT_MATCH;

  const job = (jobSkills || []).map(norm).filter(Boolean);

  console.log(`\n[DEBUG] --- Matching for: ${title} ---`);

  // Fallback: If no explicit skills found, search for resume keywords in description
  if (job.length === 0) {
    if (!jobDescription) return DEFAULT_MATCH;

    console.log("[DEBUG] Mode: Description Fallback Search");
    let matchedKeywords = [];
    for (const rs of resume) {
      // Check both normalized and raw description for partial matches
      if (normDesc.includes(rs) || rawDesc.includes(rs)) {
        matchedKeywords.push(rs);
      }
    }

    console.log("[DEBUG] Matched Keywords:", matchedKeywords);
    console.log("[DEBUG] Total Resume Skills Considered:", resume.length);

    // FIX: Don't divide by the entire resume length (which could be 20+).
    // Usually a job cares about 6-8 core keywords.
    const targetCount = Math.min(resume.length, 8); 
    const score = Math.round((matchedKeywords.length / targetCount) * 100);

    console.log(`[DEBUG] Final Match Score Calculation: (${matchedKeywords.length} hits / ${targetCount} target) * 100 = ${score}%`);
    const finalScore = Math.max(DEFAULT_MATCH, Math.min(95, score));
    return finalScore;
  }

  // Primary: Compare resume skills to required job skills
  console.log("[DEBUG] Mode: Explicit Job Skills Comparison");
  console.log("[DEBUG] Job Required Skills:", job);

  let matches = 0;
  let matchedList = [];
  for (const jSkill of job) {
    const hit = resume.some(
      (r) =>
        r === jSkill ||
        r.includes(jSkill) ||
        jSkill.includes(r) ||
        r.split(/[\s,]+/).some((tok) => tok && jSkill.includes(tok))
    );
    if (hit) {
      matches++;
      matchedList.push(jSkill);
    }
  }

  console.log("[DEBUG] Matched Skills:", matchedList);
  const score = Math.min(100, Math.round((matches / job.length) * 100));
  console.log(`[DEBUG] Final Match Score Calculation: (${matches} hits / ${job.length} required) * 100 = ${score}%`);
  return score;
}

/**
 * Pull a list of required skills from a JSearch job object (field names vary).
 */
function extractJobSkills(job) {
  if (!job || typeof job !== "object") return [];

  // Array of strings
  if (Array.isArray(job.job_required_skills)) {
    return job.job_required_skills.map(String).filter(Boolean);
  }
  // Single string (comma-separated)
  if (typeof job.job_required_skills === "string" && job.job_required_skills.trim()) {
    return job.job_required_skills.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
  }
  // Sometimes skills live in highlights
  if (Array.isArray(job.job_highlights)) {
    const skills = [];
    for (const h of job.job_highlights) {
      if (typeof h === "string") skills.push(h);
      else if (h?.items && Array.isArray(h.items)) skills.push(...h.items.map(String));
    }
    return skills.filter(Boolean);
  }
  return [];
}

/**
 * Map one JSearch result to our shape + match %.
 */
function mapJobToResult(raw, resumeSkills) {
  const title = raw.job_title || raw.title || raw.position || "Open role";
  const company = raw.employer_name || raw.company_name || raw.company || "Company";
  const link = raw.job_apply_link || raw.apply_link || raw.job_google_link || "#";

  const jobDescription = raw.job_description || "";
  const jobSkills = extractJobSkills(raw);
  const match = computeMatchPercent(resumeSkills, jobSkills, jobDescription, title);

  return {
    title,
    company,
    match,
    link,
  };
}

/**
 * Call RapidAPI JSearch (or compatible host) for jobs in India.
 * Subscribe: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
 */
async function fetchJobsFromRapidApi(role) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY is not set in .env");
  }

  // Default: JSearch on RapidAPI
  const host =
    process.env.RAPIDAPI_JOB_HOST || "jsearch.p.rapidapi.com";

  const query = (role || "Software Developer").trim() || "Software Developer";

  const { data } = await axios.get(`https://${host}/search`, {
    params: {
      query,
      page: 1,
      num_pages: 1,
      country: "in",
    },
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": host,
    },
    timeout: 25_000,
  });

  const list = Array.isArray(data?.data) ? data.data : [];
  return list;
}

/**
 * POST /api/resume/jobs
 * multipart field name: resume (PDF)
 */
export const analyzeResumeAndFetchJobs = async (req, res) => {
  let parser;
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({
        message: "Please upload a PDF file (field name: resume).",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed." });
    }

    // --- 1) PDF → text (pdf-parse v2 API) ---
    parser = new PDFParse({ data: req.file.buffer });
    const textResult = await parser.getText();
    const fullText = (textResult?.text || "").trim();

    if (!fullText || fullText.length < 30) {
      return res.status(400).json({
        message:
          "Could not read enough text from this PDF. Try another file or a text-based PDF.",
      });
    }

    const resumeSnippet =
      fullText.length > MAX_RESUME_CHARS
        ? fullText.slice(0, MAX_RESUME_CHARS)
        : fullText;

    // --- 2) AI: skills + role ---
    const messages = [
      { role: "system", content: RESUME_ANALYSIS_SYSTEM },
      {
        role: "user",
        content: `Resume:\n\n${resumeSnippet}`,
      },
    ];

    const aiRaw = await askAi(messages);
    const parsed = parseAiJson(aiRaw);

    const skills = Array.isArray(parsed.skills)
      ? parsed.skills.map((s) => String(s).trim()).filter(Boolean)
      : [];
    const role =
      typeof parsed.role === "string" ? parsed.role.trim() : "";

    console.log("\n[DEBUG] --- Overall Resume Extraction ---");
    console.log("[DEBUG] Extracted Role:", role);
    console.log("[DEBUG] Extracted Skills:", skills);

    if (!role) {
      return res.status(422).json({
        message: "AI could not infer a job role from this resume. Try a clearer PDF.",
        skills,
        role: "",
        jobs: [],
      });
    }

    // --- 3) RapidAPI jobs ---
    let jobs = [];
    let fetchError = null;
    try {
      const rawJobs = await fetchJobsFromRapidApi(role);
      jobs = rawJobs
        .slice(0, 15)
        .map((j) => mapJobToResult(j, skills));
    } catch (err) {
      console.error("RapidAPI / job fetch error:", err.response?.data || err.message);
      fetchError =
        err.message ||
        "Failed to load jobs from RapidAPI. Check your API key and subscription.";
    }

    return res.json({
      skills,
      role,
      jobs,
      ...(fetchError ? { fetchError } : {}),
    });
  } catch (error) {
    console.error("analyzeResumeAndFetchJobs:", error);
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        message: "AI returned invalid JSON. Please try again.",
      });
    }
    return res.status(500).json({
      message:
        error.message?.includes("OpenRouter")
          ? "AI service error. Check OPENROUTER_API_KEY."
          : "Something went wrong processing your resume.",
    });
  } finally {
    if (parser && typeof parser.destroy === "function") {
      try {
        await parser.destroy();
      } catch (_) {
        /* ignore */
      }
    }
  }
};




/*
🚀 RESUME → JOB MATCHING WORKFLOW (High-Level)

1. User PDF upload karta hai (resume)
2. Backend PDF ko read karke uska text nikalta hai (pdf-parse)
3. Resume text AI ko bheja jata hai:
   → AI skills aur ek suitable job role return karta hai (JSON format me)
4. Extracted role ke basis pe RapidAPI se jobs fetch ki jati hain
5. Har job ke liye:
   → Job skills extract ki jati hain (different formats handle karke)
   → Resume skills ke saath compare karke match % nikala jata hai
6. Clean format me jobs + match % + role + skills frontend ko bhej diye jate hain

💡 Key Logic:
- Loose matching use kiya gaya hai (exact + partial + token-based match)
- Different API formats handle kiye gaye hain (array, string, highlights)
- Error handling + fallback + cleanup (finally block) implemented hai

👉 Simple samajh:
Resume → AI → Jobs → Match % → Response
*/