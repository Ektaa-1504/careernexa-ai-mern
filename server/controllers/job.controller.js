import { askAi } from "../services/openRouter.service.js";

const JOB_ANALYSIS_SYSTEM = `You are a career assistant.

Analyze the following job description and extract:

1. Required technical skills
2. Required soft skills
3. Experience level (Beginner / Intermediate / Advanced)
4. Key responsibilities (3-5 points)
5. Important keywords for resume optimization

Return JSON only, no markdown, no code fences:
{
  "skills": [],
  "softSkills": [],
  "experienceLevel": "",
  "responsibilities": [],
  "keywords": []
}`;

function parseAiJson(content) {
  let text = (content || "").trim();
  if (text.startsWith("```")) {
    const firstLineBreak = text.indexOf("\n");
    text = text.slice(firstLineBreak + 1);
    const fenceEnd = text.lastIndexOf("```");
    if (fenceEnd !== -1) text = text.slice(0, fenceEnd);
  }
  return JSON.parse(text.trim());
}

/**
 * POST /api/job/analyze
 * body: { jobDescription: string }
 */
export const analyzeJobDescription = async (req, res) => {
  try {
    const jobDescription = (req.body.jobDescription || "").trim();
    if (!jobDescription || jobDescription.length < 50) {
      return res.status(400).json({
        message:
          "Please paste a complete job description (at least 50 characters).",
      });
    }

    const messages = [
      { role: "system", content: JOB_ANALYSIS_SYSTEM },
      { role: "user", content: jobDescription },
    ];

    const aiResponse = await askAi(messages);
    const parsed = parseAiJson(aiResponse);

    const payload = {
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      softSkills: Array.isArray(parsed.softSkills) ? parsed.softSkills : [],
      experienceLevel:
        typeof parsed.experienceLevel === "string"
          ? parsed.experienceLevel
          : "",
      responsibilities: Array.isArray(parsed.responsibilities)
        ? parsed.responsibilities
        : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    };

    return res.json(payload);
  } catch (error) {
    console.error("analyzeJobDescription:", error);
    return res.status(500).json({
      message: "Failed to analyze job description. Please try again.",
    });
  }
};
