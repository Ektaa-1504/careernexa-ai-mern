import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react";
import axios from "axios"
import { ServerUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'
import MainLayout from '../components/MainLayout'
import PageShell from '../components/PageShell'

function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })

                setInterviews(result.data)

            } catch (error) {
                console.log(error)
            }

        }

        getMyInterviews()

    }, [])


    return (
        <MainLayout>
        <PageShell className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 py-10" >
            <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">

                <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className='mt-1 p-3 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition'><FaArrowLeft className='text-gray-600' /></button>

                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight">
                            Interview History
                        </h1>
                        <p className="text-sm text-gray-500 mt-2 text-base">
                            Track your past interviews and performance reports
                        </p>

                    </div>
                </div>


                {interviews.length === 0 ?
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
                        <p className="text-sm text-gray-500">
                            No interviews found. Start your first interview.
                        </p>

                    </div>

                    :

                    <div className='grid gap-6'>
                        {interviews.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -4, scale: 1.01, borderColor: "rgb(16 185 129 / 0.3)" }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => navigate(`/report/${item._id}`)}
                                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:border-emerald-200 shadow-md transition-colors"
                            >
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {item.role}
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-1">
                                            {item.experience} • {item.mode}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-6'>

                                        {/* SCORE */}
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-emerald-600">
                                                {item.finalScore || 0}/10
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Overall Score
                                            </p>
                                        </div>

                                        {/* STATUS BADGE */}
                                        <span
                                            className={`px-4 py-1 rounded-full text-xs font-medium ${item.status === "completed"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>


                                    </div>
                                </div>

                            </motion.div>
                        ))
                        }

                    </div>
                }
            </div>

        </div>
        </PageShell>
        </MainLayout>
    )
}

export default InterviewHistory
