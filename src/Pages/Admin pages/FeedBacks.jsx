import React, { useEffect, useState } from "react";
import { Trash2, CheckCircle } from "lucide-react";
import { deletefeedbackApi, getAllfeedbackApi } from "../../services/allApi";
import { toast } from "react-toastify";

function FeedBacks() {
    const [feedbacks, setFeedbacks] = useState({});

    useEffect(() => {
      getAllFeedback()
    }, [])
    
    const getAllFeedback=async()=>{
        const result = await getAllfeedbackApi()
        setFeedbacks(result.data)   
    }

    const handleDeleteFeedback =async (id) => {
        
        try {
            const result = await deletefeedbackApi(id)
            if(result.status==200){
                getAllFeedback()
                toast.warning("removed user feed back")
            }
        } catch (error) {
            console.log(error);
            
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-slideUp">
            <div className="mb-6">
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Admin</p>
                <p className="text-2xl font-bold text-gray-800 section-title">User Feedbacks</p>
            </div>
            {feedbacks.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {feedbacks.map((feedback, index) => (
                        <div key={index} className="rounded-2xl p-4 animate-fadeIn"
                            style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 10px rgba(24,119,242,0.07)", animationDelay: `${index * 40}ms` }}>
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm">{feedback?.username}</p>
                                    <p className="text-gray-600 text-sm mt-1 break-words">{feedback?.message}</p>
                                    <p className="text-gray-400 text-xs mt-2">{feedback.date}</p>
                                </div>
                                <button onClick={() => handleDeleteFeedback(feedback._id)}
                                    className="p-2.5 rounded-xl text-white shrink-0 transition-all hover:scale-105 active:scale-95"
                                    style={{ background: "linear-gradient(135deg, #ef4444, #f87171)", boxShadow: "0 2px 8px rgba(239,68,68,0.3)" }}>
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center py-16 gap-3 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.7)", border: "1.5px dashed #bfdbfe" }}>
                    <i className="fa-solid fa-comment-slash text-blue-300 text-4xl"></i>
                    <p className="text-gray-500 font-medium">No feedback available</p>
                </div>
            )}
        </div>
    );
}

export default FeedBacks;
