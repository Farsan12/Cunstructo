// Chat.jsx
import React, { useContext, useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import Chatpanel from "./Chatpanel";
import Header from "../../Componets/Header";
import { useWindowSize } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";
import { getuserforsidebarApi, getusersandworkersforsidebarApi } from "../../services/allApi";
import { reciverIdContext, selectedChattoUserContext } from "../../Context/OtherPurpuseContextApi";
import { FaComment, FaCommentMedical, FaMale } from "react-icons/fa";


function Chat() {

    const { selectduserResponse, setselectduserResponse } = useContext(selectedChattoUserContext)
    const { setreciveridResponse } = useContext(reciverIdContext)
    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")
    const navigate = useNavigate();
    const { width } = useWindowSize();

    const [chatWorkers, setChatworkers] = useState([])

    useEffect(() => {
        getAllworkesforSidebar()
    }, [])

    const getAllworkesforSidebar = async () => {
        try {

            if (token) {
                const reqheader = {
                    "content-type": "application/json",
                    "authorization": `Bearer ${token}`
                }
                if (user.roll == "user") {
                    const result = await getuserforsidebarApi(reqheader)
                    setChatworkers(result.data)

                } else {
                    const result = await getusersandworkersforsidebarApi(reqheader)
                    setChatworkers(result.data)

                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChatSelect = (worker) => {
        if (width < 768) {
            setreciveridResponse(worker._id)
            localStorage.setItem("toReciverData", JSON.stringify(worker))
            navigate('/chatpanel');

        } else {
            localStorage.setItem("toReciverData", JSON.stringify(worker))
            setreciveridResponse(worker._id);
            setselectduserResponse(worker._id)

        }
    };


    return (
        <div className="h-screen flex flex-col" style={{ background: "#f0f4ff" }}>
            <Header />

            <div className="flex flex-grow h-full w-full">
                {/* Chat List */}
                <div className="w-full z-10 md:w-96 h-full flex flex-col animate-slideInLeft"
                    style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRight: "1px solid #e0e8ff" }}>

                    {/* Chat Header */}
                    <div className="px-5 py-4 flex items-center gap-2"
                        style={{ borderBottom: "1px solid #e0e8ff" }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #1877F2, #42a5f5)" }}>
                            <FaComment className="text-white text-sm" />
                        </div>
                        <h2 className="text-base font-bold text-gray-800">Chats</h2>
                    </div>

                    <div
                        style={{ scrollbarWidth: 'thin' }}
                        className={`flex-grow md:h-[80vh] overflow-y-auto ${
                            chatWorkers?.length === 0 ? 'flex justify-center rotate-90 items-center' : ''
                        }`}
                    >
                        {chatWorkers.length > 0 ? (
                            <div>
                                {chatWorkers?.map((workers, key) => (
                                    <ChatCard key={key} workers={workers} onSelect={() => handleChatSelect(workers)} />
                                ))}
                            </div>
                        ) : (
                            <span className="loading loading-bars text-blue-300 loading-xl"></span>
                        )}
                    </div>
                </div>

                {/* Chat Panel */}
                <div className="hidden md:flex flex-1 h-full"
                    style={{ background: "#f0f4ff" }}>
                    {selectduserResponse ? (
                        <Chatpanel />
                    ) : (
                        <div className="flex-1 flex items-center w-full justify-center">
                            <div className="text-center animate-scaleIn">
                                <div className="flex gap-5 justify-center mb-6">
                                    <FaComment className="text-8xl animate-pulse" style={{ color: "#bfdbfe", transform: "scaleX(-1)" }} />
                                    <FaComment className="text-8xl animate-bounce" style={{ color: "#93c5fd", animationDelay: "0.2s" }} />
                                </div>
                                <p className="text-gray-400 text-base font-medium">Select a chat to start messaging</p>
                                <p className="text-gray-300 text-sm mt-1">Your conversations will appear here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Chat;