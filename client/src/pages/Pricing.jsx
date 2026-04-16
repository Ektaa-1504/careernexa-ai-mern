import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react";
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import MainLayout from '../components/MainLayout';
import PageShell from '../components/PageShell';

function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch()

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];



  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      const amount =  
      plan.id === "basic" ? 100 :
      plan.id === "pro" ? 500 : 0;

      const result = await axios.post(ServerUrl + "/api/payment/order" , {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      },{withCredentials:true})
      

      const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: result.data.amount,
      currency: "INR",
      name: "InterviewIQ.AI",
      description: `${plan.name} - ${plan.credits} Credits`,
      order_id: result.data.id,

      handler:async function (response) {
        const verifypay = await axios.post(ServerUrl + "/api/payment/verify" ,response , {withCredentials:true})
        dispatch(setUserData(verifypay.data.user))

          alert("Payment Successful 🎉 Credits Added!");
          navigate("/")

      },
      theme:{
        color: "#10b981",
      },

      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      setLoadingPlan(null);
    } catch (error) {
     console.log(error)
     setLoadingPlan(null);
    }
  }



  return (
    <MainLayout>
    <PageShell className="flex-1 flex flex-col min-h-0">
    <div className='flex-1 py-16 px-4 sm:px-6'>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 mb-14 flex items-start gap-4">

        <button type="button" onClick={() => navigate("/")} className='mt-2 p-3 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition shrink-0'>
          <FaArrowLeft className='text-gray-600' />
        </button>

        <div className="text-center w-full min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-500 mt-3">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>


      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto w-full max-w-6xl px-4 sm:px-6">

        {plans.map((plan, i) => {
          const isSelected = selectedPlan === plan.id

          return (
              <motion.div
                key={plan.id}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className={`relative bg-white rounded-2xl shadow-lg border border-gray-200 p-8 transition-all duration-300 cursor-pointer
                  ${isSelected
                    ? "ring-2 ring-emerald-500 border-emerald-500 shadow-xl"
                    : "hover:border-emerald-200"
                  }
                  ${plan.default ? "cursor-default" : ""}
                `}
              >

              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className="absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                  Default
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-semibold text-gray-800">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4">
                <span className="text-3xl font-bold text-emerald-600">
                  {plan.price}
                </span>
                <p className="text-gray-500 mt-1">
                  {plan.credits} Credits
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                {plan.description}
              </p>

              {/* Features */}
              <div className="mt-6 space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FaCheckCircle className="text-emerald-500 text-sm" />
                    <span className="text-gray-700 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!plan.default &&
                (isSelected ? (
                  <motion.button
                    type="button"
                    whileHover={!(loadingPlan === plan.id) ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!(loadingPlan === plan.id) ? { scale: 0.98, y: 0 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    disabled={loadingPlan === plan.id}
                    className="w-full mt-8 inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayment(plan);
                    }}
                  >
                    {loadingPlan === plan.id ? "Processing..." : "Proceed to Pay"}
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-full mt-8 inline-flex items-center justify-center font-semibold text-sm sm:text-base border-2 border-gray-200 bg-white text-gray-800 py-3 px-6 rounded-2xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan.id);
                    }}
                  >
                    Select Plan
                  </motion.button>
                ))
              }
            </motion.div>
          )
        })}
      </div>

    </div>
    </PageShell>
    </MainLayout>
  )
}

export default Pricing
