import React from 'react'
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
    FaMicrophoneAlt,
    FaChartLine,
} from "react-icons/fa";
import { useState } from 'react';
import axios from "axios"
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";

function Step1SetUp({ onStart }) {
    const {userData}= useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [showCreditPopup, setShowCreditPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        setAnalyzing(true)

        const formdata = new FormData()
        formdata.append("resume", resumeFile)

        try {
            const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true })

            console.log(result.data)

            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);

            setAnalyzing(false);

        } catch (error) {
            console.log(error)
            setAnalyzing(false);
        }
    }

    const handleStart = async () => {
        setErrorMessage("");
        setLoading(true)
        try {
           const result = await axios.post(ServerUrl + "/api/interview/generate-questions" , {role, experience, mode , resumeText, projects, skills } , {withCredentials:true}) 
           console.log(result.data)
           if(userData){
            dispatch(setUserData({...userData , credits:result.data.creditsLeft}))
           }
           setLoading(false)
           onStart(result.data)

        } catch (error) {
            console.log(error)
            const serverMessage = error?.response?.data?.message || "Failed to start interview. Please try again.";

            if (
                error?.response?.status === 400 &&
                serverMessage.toLowerCase().includes("not enough credits")
            ) {
                setShowCreditPopup(true);
            } else {
                setErrorMessage(serverMessage);
            }
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-100 px-4 py-10">

            <div className='w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-gray-200 grid md:grid-cols-2 overflow-hidden'>

                <div className='relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-10 md:p-12 flex flex-col justify-center border-r border-gray-100'>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-4">
                        Start Your AI Interview
                    </h2>

                    <p className="text-gray-500 text-base mb-10 leading-relaxed">
                        Practice real interview scenarios powered by AI.
                        Improve communication, technical skills, and confidence.
                    </p>

                    <div className='space-y-5'>

                        {
                            [
                                {
                                    icon: <FaUserTie className="text-emerald-600 text-xl" />,
                                    text: "Choose Role & Experience",
                                },
                                {
                                    icon: <FaMicrophoneAlt className="text-emerald-600 text-xl" />,
                                    text: "Smart Voice Interview",
                                },
                                {
                                    icon: <FaChartLine className="text-emerald-600 text-xl" />,
                                    text: "Performance Analytics",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className='flex items-center space-x-4 bg-white/90 border border-gray-200 p-4 rounded-2xl shadow-sm cursor-pointer hover:border-emerald-200 transition'
                                >
                                    {item.icon}
                                    <span className='text-gray-800 font-medium text-sm'>{item.text}</span>

                                </div>
                            ))
                        }
                    </div>



                </div>



                <div className="p-10 md:p-12 bg-white">

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-8">
                        Interview SetUp
                    </h2>


                    <div className='space-y-6'>

                        <div className='relative'>
                            <FaUserTie className='absolute top-4 left-4 text-gray-400' />

                            <input type='text' placeholder='Enter role'
                                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-800 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition pl-12 pr-4 py-3.5"
                                onChange={(e) => setRole(e.target.value)} value={role} />
                        </div>


                        <div className='relative'>
                            <FaBriefcase className='absolute top-4 left-4 text-gray-400' />

                            <input type='text' placeholder='Experience (e.g. 2 years)'
                                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-800 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition pl-12 pr-4 py-3.5"
                                onChange={(e) => setExperience(e.target.value)} value={experience} />



                        </div>

                        <select value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition">

                            <option value="Technical">Technical Interview</option>
                            <option value="HR">HR Interview</option>

                        </select>

                        {!analysisDone && (
                            <div
                                onClick={() => document.getElementById("resumeUpload").click()}
                                className='border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition'>

                                <FaFileUpload className='text-4xl mx-auto text-emerald-600 mb-3' />

                                <input type="file"
                                    accept="application/pdf"
                                    id="resumeUpload"
                                    className='hidden'
                                    onChange={(e) => setResumeFile(e.target.files[0])} />

                                <p className='text-gray-600 font-medium'>
                                    {resumeFile ? resumeFile.name : "Click to upload resume (Optional)"}
                                </p>

                                {resumeFile && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUploadResume()
                                        }}

                                        className='mt-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition'>
                                        {analyzing ? "Analyzing..." : "Analyze Resume"}



                                    </button>)}

                            </div>


                        )}

                        {analysisDone && (
                            <div className='bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4'>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Resume Analysis Result</h3>

                                {projects.length > 0 && (
                                    <div>
                                        <p className='font-medium text-gray-700 mb-1'>
                                            Projects:</p>

                                        <ul className='list-disc list-inside text-gray-600 space-y-1'>
                                            {projects.map((p, i) => (
                                                <li key={i}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {skills.length > 0 && (
                                    <div>
                                        <p className='font-medium text-gray-700 mb-1'>
                                            Skills:</p>

                                        <div className='flex flex-wrap gap-2'>
                                            {skills.map((s, i) => (
                                                <span key={i} className='bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm border border-emerald-200'>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}


                        <motion.button
                            type="button"
                            whileHover={!( !role || !experience || loading) ? { scale: 1.02, y: -1 } : {}}
                            whileTap={!( !role || !experience || loading) ? { scale: 0.98, y: 0 } : {}}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            onClick={handleStart}
                            disabled={!role || !experience || loading}
                            className="w-full justify-center py-3.5 text-base rounded-2xl inline-flex items-center justify-center font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? "Starting..." : "Start Interview"}
                        </motion.button>

                        {errorMessage && (
                            <p className='text-sm text-red-600 font-medium'>
                                {errorMessage}
                            </p>
                        )}
                    </div>

                </div>
            </div>

            {showCreditPopup && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'>
                    <div className='w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-4'>
                        <h3 className='text-xl font-bold text-gray-800'>
                            You are out of credits
                        </h3>
                        <p className='text-gray-600'>
                            A minimum of 50 credits is required to start an interview. Please purchase credits to continue.
                        </p>
                        <div className='flex items-center justify-end gap-3 pt-2'>
                            <button
                                onClick={() => setShowCreditPopup(false)}
                                className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition'
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/pricing")}
                                className="inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 text-sm"
                            >
                                Purchase Credits
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Step1SetUp
