import React, { useState, useEffect } from "react";
import { sendFeedbackApi } from "../../services/allApi";
import { toast } from "react-toastify";

function FeedBackuser() {
  const token = localStorage.getItem("token");

  const [feedback, setFeedback] = useState({message:"",date:""});
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 2000); 

      return () => clearTimeout(timer); 
    }
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newDate = new Date()
    let dates = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    const formattedDate = `${dates}-${month}-${year}`;

    const reqheader = {
      "content-type": "application/json",
      "authorization": `Bearer ${token}`
    }
    setFeedback({ ...feedback, date: formattedDate });

    const {date,message}=feedback

    const dataToSend = {
      message: feedback.message,
      date: formattedDate
    };

    if (date,message) {
      
      try {
        const result = await sendFeedbackApi(dataToSend, reqheader)
        if (result.status >= 200 && result.status <= 299) {
          setSubmitted(true);
          setFeedback({message: "", date: "" });
        }
        else{
          toast.warning("try again")
        }
      } catch (error) {
        console.log(error);

      }

    }
  };

 
  return (
    <div className="max-w-2xl mx-auto animate-slideUp">
      <div className="mb-6 md:mt-0 mt-4">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Support</p>
        <p className="text-2xl font-bold text-gray-800 section-title">Send Feedback</p>
      </div>
      <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 12px rgba(24,119,242,0.07)" }}>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-500">Tell us what you think — your feedback helps us improve.</p>
            <textarea
              className="w-full p-3 rounded-xl focus:outline-none input-glow transition-all resize-none"
              style={{ border: "1.5px solid #c7d7fa", background: "#f8faff", minHeight: "130px" }}
              placeholder="Write your feedback here..."
              value={feedback.message}
              onChange={(e) => setFeedback({message: e.target.value})}
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-bold tracking-wide transition-all hover:scale-[1.01] hover:shadow-lg active:scale-95"
              style={{ background: "linear-gradient(135deg, #1877F2, #42a5f5)", boxShadow: "0 4px 16px rgba(24,119,242,0.4)" }}
            >
              Submit Feedback
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center py-8 gap-3 animate-scaleIn">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #22c55e, #4ade80)" }}>
              <i className="fa-solid fa-check text-white text-2xl"></i>
            </div>
            <p className="text-lg font-bold text-green-600">Thank you for your feedback!</p>
            <p className="text-sm text-gray-500">We appreciate you taking the time to share your thoughts.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedBackuser;
