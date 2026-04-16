

import React from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import Timer from './Timer'
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { ServerUrl } from '../App'
import { BsArrowRight } from 'react-icons/bs'
import { motion } from "motion/react";

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [isTimerActive, setIsTimerActive] = useState(false);
  const lastSpokenIndex = useRef(-1);


  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];


  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // Try known female voices first
      const femaleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Try known male voices
      const maleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
        );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback: first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  function startMic() {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch {
        // ignore: start can throw if already started
      }
    }
  }

  function stopMic() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }


  /* ---------------- SPEAK FUNCTION ---------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Deep Warm-up Fix: Prepend "., " to force a microscopic silent pause before words
      // This gives the audio system even more time to ramp up.
      const humanText = "., " + text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      // Human-like pacing
      utterance.rate = 0.92;     // slightly slower than normal
      utterance.pitch = 1.05;    // small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic()
        videoRef.current?.play();
      };


      // Safety timeout: Resolve after 10s if onend fails to fire (prevents UI freeze)
      const safetyTimeout = setTimeout(() => {
        if (setIsAIPlaying) {
          videoRef.current?.pause();
          setIsAIPlaying(false);
          if (isMicOn) startMic();
          setSubtitle("");
          resolve();
        }
      }, 10000);

      utterance.onend = () => {
        clearTimeout(safetyTimeout);
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      utterance.onerror = (e) => {
        console.error("Speech Error:", e);
        clearTimeout(safetyTimeout);
        videoRef.current?.pause();
        setIsAIPlaying(false);
        if (isMicOn) startMic();
        setSubtitle("");
        resolve(); // Resolve anyway to prevent system hang
      };

      utterance.onpause = () => {
        clearTimeout(safetyTimeout);
        videoRef.current?.pause();
        setIsAIPlaying(false);
        resolve();
      };


      setSubtitle(text);

      // Stabilization delay: increased to 400ms for deeper warm-up
      // This prevents the first few words from being clipped.
      setTimeout(() => {
        window.speechSynthesis.resume(); // Explicit engine wake-up
        window.speechSynthesis.speak(utterance);
      }, 400);
    });
  };


  useEffect(() => {
    if (!selectedVoice) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );
        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );
        setIsIntroPhase(false);
      } else if (currentQuestion && lastSpokenIndex.current !== currentIndex) {
        // Prevent repeating the same question
        lastSpokenIndex.current = currentIndex;
        setIsTimerActive(false); // Ensure timer is off while speaking

        await new Promise((r) => setTimeout(r, 800));

        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);
        
        // TIMER STARTS ONLY AFTER SPEAKING
        setIsTimerActive(true);

        if (isMicOn) {
          startMic();
        }
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);



  async function submitAnswer(isAuto = false) {
    if (isSubmitting) return;
    setIsTimerActive(false); // STOP THE TIMER
    stopMic();
    setIsSubmitting(true);

    try {
      const isLastQuestion = currentIndex + 1 === questions.length;

      if (!answer.trim()) {
        const emptyMsg = "You did not submit an answer. Alright, let’s move to the next question.";
        setFeedback("You did not submit an answer.");
        
        // ONLY speak the full transition message if NOT the last question
        if (!isLastQuestion) {
          await speakText(emptyMsg);
        }
        
        // Notify backend of empty answer
        await axios.post(
          ServerUrl + "/api/interview/submit-answer",
          {
            interviewId,
            questionIndex: currentIndex,
            answer: "",
            timeTaken: currentQuestion.timeLimit - timeLeft,
          },
          { withCredentials: true }
        );
        
        setIsSubmitting(false);
        handleNext();
        return;
      }

      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true }
      );

      setFeedback(result.data.feedback);
      await speakText(result.data.feedback);

      // NATURAL TRANSITION: speak only if not the last question
      if (currentIndex + 1 < questions.length) {
        await speakText("Alright, let’s move to the next question.");
      }

      setIsSubmitting(false);

      // AUTOMATIC PROGRESSION logic
      // UNLESS it's a milestone question (multiple of 5)
      if ((currentIndex + 1) % 5 !== 0) {
        setTimeout(() => {
          handleNext();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (isIntroPhase || !isTimerActive || feedback) return;
    if (!currentQuestion) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isSubmitting) {
            submitAnswer(true); // Always submit on timeout to get feedback
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer)

  }, [isIntroPhase, isTimerActive, currentIndex, isSubmitting, feedback])

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true; // REAL-TIME TRANSCRIPTION

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setAnswer((prev) => prev + " " + finalTranscript);
      }
      
      // We don't necessarily want to set the answer to interim 
      // because it might overwrite what we have. 
      // But for a live feeling, we could show it.
      // For now, appending final results is safer, but let's make it smoother.
      setSubtitle(interimTranscript); // Using subtitle for real-time visual feedback
    };

    recognitionRef.current = recognition;

  }, []);


  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };


  const handleNext = async () => {
    setAnswer("");
    setFeedback("");
    setIsTimerActive(false); // Reset timer state for next question

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    // DON'T await OR await?
    // User wants move forward. Let's not await the "Alright let's move" part 
    // to ensure the UI updates the index immediately.
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setTimeLeft(questions[nextIndex]?.timeLimit || 60);
    
    // Safety: ensure timer starts even if speakText didn't trigger it
    setTimeout(() => {
      setIsTimerActive(true);
      if (isMicOn) startMic();
    }, 1500);
  }

  const finishInterview = async () => {
    stopMic()
    setIsMicOn(false)
    try {
      const result = await axios.post(ServerUrl+ "/api/interview/finish" , { interviewId} , {withCredentials:true})

      console.log(result.data)
      onFinish(result.data)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);







  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6">
      <div className='w-full max-w-6xl min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

        {/* video section */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* subtitle */}
          {subtitle && (
            <div className='w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm'>
              <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
            </div>
          )}


          {/* timer Area */}
          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-500'>
                Interview Status
              </span>
              {isAIPlaying && <span className='text-sm font-semibold text-emerald-600'>
                {isAIPlaying ? "AI Speaking" : ""}
              </span>}
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className='flex justify-center'>

              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-bold text-emerald-600'>{currentIndex + 1}</span>
                <span className='text-xs text-gray-400'>Current Questions</span>
              </div>

              <div>
                <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                <span className='text-xs text-gray-400'>Total Questions</span>
              </div>
            </div>


          </div>
        </div>

        {/* Text section */}

        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
          <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>
            AI Smart Interview
          </h2>


          {!isIntroPhase && (<div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
            <p className="text-xs sm:text-sm text-gray-400 mb-2">
              Question {currentIndex + 1} of {questions.length}
            </p>

            <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed ">
              {currentQuestion?.question}
            </div>
          </div>
        )}
          <textarea
            placeholder="Type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            className="flex-1 min-h-[180px] sm:min-h-[220px] w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-800 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-y min-h-[120px] p-4 sm:p-6 rounded-2xl"
          />


          {!feedback ? (
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={toggleMic}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg border border-gray-700"
              >
                {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
              </button>

              <motion.button
                type="button"
                whileHover={!isSubmitting ? { scale: 1.02, y: -1 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98, y: 0 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={submitAnswer}
                disabled={isSubmitting}
                className="flex-1 w-full py-3 sm:py-4 inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <div className="mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm">
              <p className="text-emerald-700 font-medium mb-4">{feedback}</p>

              {(currentIndex + 1) === questions.length ? (
                <div className="space-y-4">
                  <p className="text-emerald-700 font-bold text-lg">
                    🎉 Round Finished! Great job completing the interview.
                  </p>
                  <p className="text-gray-600 text-sm">
                    You have successfully completed this round of questions. You can now view your final report.
                  </p>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={finishInterview}
                    className="w-full flex items-center justify-center gap-1 inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md transition-colors duration-200"
                  >
                    View Result <BsArrowRight size={18} />
                  </motion.button>
                </div>
              ) : (currentIndex + 1) % 5 === 0 ? (
                <div className="space-y-4">
                  <p className="text-gray-600 italic text-sm">
                    “That completes this round of questions. Well done.”
                  </p>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-1 inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md transition-colors duration-200"
                  >
                    Finish Round <BsArrowRight size={18} />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-1 inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next Question <BsArrowRight size={18} />
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Step2Interview
