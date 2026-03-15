import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { reciverIdContext, selectedChattoUserContext } from '../../Context/OtherPurpuseContextApi';
import { getmessageApi, sendmessageApi } from '../../services/allApi';
import profileimg from '../../assets/profileimg/profileimg.webp';
import serverUrl from '../../services/serverUrl';
import { displayUserOnlineOrOflineContext } from '../../Context/SocketioContext';


function Chatpanel() {

    const navigate = useNavigate()
    const messagesEndRef = useRef(null);
    const { onlineusersResponse, isonlineworker, setonlineworker, messages, setMessages } = useContext(displayUserOnlineOrOflineContext)
    const { reciveridResponse } = useContext(reciverIdContext);
    const { setselectduserResponse } = useContext(selectedChattoUserContext)
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const toReciverData = JSON.parse(localStorage.getItem("toReciverData"));
    const reciverid = reciveridResponse || localStorage.getItem("reciverid");


    const [newMessage, setNewMessage] = useState('');
    const [targetLang, setTargetLang] = useState('en');
    const [translations, setTranslations] = useState({});


    // Setup socket connection ONCE
    useEffect(() => {
        if (reciverid && onlineusersResponse.length > 0) {
            setonlineworker(onlineusersResponse.includes(reciverid));
        }
    }, [reciverid, onlineusersResponse]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (token && reciverid) {
            if (reciveridResponse) {
                localStorage.setItem("reciverid", reciveridResponse);
            }
            getAllmessage();
        }
    }, [token, reciverid]);

    const getAllmessage = async () => {
        const reqheader = {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        };

        try {
            const result = await getmessageApi(reciverid, reqheader);
            setMessages(result.data);

        } catch (error) {
            console.log(error);
        }
    };

    const sendMessage = async () => {
        if (token && newMessage.trim() !== '') {
            try {
                const reqheader = {
                    "content-type": "application/json",
                    "authorization": `Bearer ${token}`
                };

                const newMsg = { text: newMessage ,  senderId: user._id };

                const result = await sendmessageApi(reciverid, newMsg, reqheader);
                if (result.status === 200) {
                    setMessages([...messages, newMsg]);
                    setNewMessage('');
                    getAllmessage(); // Optionally optimize later
                }

            } catch (error) {
                console.log(error);
            }
        }
    };

    const hanidileclose = () => {
        navigate("/chats")
        setselectduserResponse("")
    }

    const translateMessage = async (msg, index) => {
        if (!msg?.text) return;
        const key = `${msg._id || index}-${targetLang}`;
        if (translations[key]) return; // already translated

        try {
            const encoded = encodeURIComponent(msg.text);
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encoded}`);
            const data = await res.json();
            const translated = Array.isArray(data) && Array.isArray(data[0]) && Array.isArray(data[0][0]) ? data[0][0][0] : '';
            if (translated) {
                setTranslations(prev => ({ ...prev, [key]: translated }));
            }
        } catch (error) {
            console.log('Translation failed', error);
        }
    }

    return (
        <div className="flex flex-col w-full h-screen" style={{ background: "#f0f4ff" }}>
            {/* Chat Header */}
            <div className="text-white z-50 fixed w-full md:static flex items-center justify-between p-3 px-5"
                style={{
                    background: "linear-gradient(135deg, #0d47c8, #1877F2)",
                    boxShadow: "0 4px 20px rgba(24,119,242,0.3)",
                    borderBottom: "1px solid rgba(255,255,255,0.15)"
                }}>
                <div className='flex items-center gap-3'>
                    <Link className='md:hidden text-white/80 hover:text-white transition-colors' to={'/chats'}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </Link>
                    <div className="relative">
                        <img
                            className={toReciverData?.profilepic
                                ? 'w-10 h-10 shadow-md rounded-full object-cover border-2 border-white/30'
                                : 'w-10 h-10 p-1.5 bg-white/20 shadow-md rounded-full border-2 border-white/30'}
                            src={toReciverData?.profilepic ? `${serverUrl}/uploads/${toReciverData.profilepic}` : profileimg}
                            alt=""
                        />
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${isonlineworker ? 'bg-green-400' : 'bg-gray-400'}`} />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm">{toReciverData?.username}</h2>
                        <span className={`text-xs ${isonlineworker ? 'text-green-300' : 'text-blue-200'}`}>
                            {isonlineworker ? '● Online' : '○ Offline'}
                        </span>
                    </div>
                </div>
                <div className='hidden md:block'>
                    <i onClick={hanidileclose}
                        className="fa-solid fa-xmark text-xl cursor-pointer text-white/70 hover:text-white transition-colors"></i>
                </div>
            </div>

            {/* Chat Messages */}
            <div style={{ scrollbarWidth: 'none' }} className="flex-1 p-4 md:mt-0 mt-12 pb-28 overflow-y-auto px-6 space-y-3">
                {messages?.map((msg, index) => {
                    const isMine = msg?.senderId === user?._id;
                    const isPayment = msg?.type === "payment" && msg?.paymentData;
                    return (
                    <div key={index} className={`flex chat flex-col lg:px-8 ${isMine ? 'chat-end' : 'chat-start'}`}>

                        {isPayment ? (
                            /* ── GPay-style payment bubble ── */
                            <div className="rounded-2xl overflow-hidden shadow-lg w-60"
                                style={{ border: "1.5px solid #c7d7fa", background: "rgba(255,255,255,0.98)" }}>
                                {/* green header */}
                                <div className="flex items-center gap-2 px-4 py-3"
                                    style={{ background: "linear-gradient(135deg, #0f9d58, #34a853)" }}>
                                    <span className="text-white text-xl">💸</span>
                                    <div>
                                        <p className="text-white text-xs font-semibold">Payment Sent</p>
                                        <p className="text-green-100 text-xs">via {msg.paymentData.method}</p>
                                    </div>
                                    <span className="ml-auto text-white text-xs opacity-70">✓ Success</span>
                                </div>
                                {/* amount */}
                                <div className="px-4 pt-3 pb-1 text-center">
                                    <p className="text-2xl font-bold text-gray-800">
                                        ₹{Number(msg.paymentData.amount).toLocaleString("en-IN")}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">Paid to <span className="font-semibold text-gray-700">{msg.paymentData.workerName}</span></p>
                                </div>
                                {/* divider + id */}
                                <div className="mx-3 my-2 border-t border-dashed border-gray-200" />
                                <div className="px-4 pb-3 flex flex-col gap-0.5">
                                    {msg.paymentData.note && (
                                        <p className="text-xs text-blue-500 truncate">📝 {msg.paymentData.note}</p>
                                    )}
                                    <p className="text-xs text-gray-300 font-mono truncate">{msg.paymentData.paymentId}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(msg?.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                            <p className={`chat-bubble text-sm break-words whitespace-pre-wrap shadow-md ${isMine ? 'text-white' : 'text-gray-800'}`}
                                style={isMine
                                    ? { background: "linear-gradient(135deg, #1877F2, #42a5f5)" }
                                    : { background: "rgba(255,255,255,0.9)", border: "1px solid #e0e8ff" }}>
                                {msg.text}
                            </p>
                            {translations[`${msg._id || index}-${targetLang}`] && (
                                <p className="text-xs bg-gray-100 text-gray-600 mt-1 px-2 py-1 rounded-lg">
                                    {translations[`${msg._id || index}-${targetLang}`]}
                                </p>
                            )}
                            <button onClick={() => translateMessage(msg, index)} className="self-end text-xs text-blue-400 hover:text-blue-600 mt-0.5 transition-colors">
                                Translate
                            </button>
                            </>
                        )}

                        <span className={`text-xs mt-0.5 ${isMine ? 'text-gray-400 text-right' : 'text-gray-400'}`}>
                            {new Date(msg?.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                    </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="sticky bottom-0" style={{ background: "rgba(255,255,255,0.95)", borderTop: "1px solid #e0e8ff", backdropFilter: "blur(12px)" }}>
                <div className="p-3 max-w-screen-xl md:max-w-screen-xl mx-auto lg:max-w-[calc(100%-20rem)] space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400 font-medium">Translate to:</span>
                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none"
                            style={{ border: "1px solid #c7d7fa", background: "#f0f4ff" }}
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="bn">Bengali</option>
                            <option value="ta">Tamil</option>
                            <option value="te">Telugu</option>
                            <option value="mr">Marathi</option>
                            <option value="gu">Gujarati</option>
                            <option value="kn">Kannada</option>
                            <option value="ml">Malayalam</option>
                            <option value="pa">Punjabi</option>
                            <option value="ur">Urdu</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-1 p-3 rounded-xl focus:outline-none transition-all input-glow"
                            style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            aria-label="Type your message"
                        />
                        <button
                            onClick={sendMessage}
                            className="p-3 rounded-xl text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40"
                            style={{ background: "linear-gradient(135deg, #1877F2, #42a5f5)", boxShadow: "0 4px 14px rgba(24,119,242,0.4)" }}
                            disabled={!newMessage.trim()}
                        >
                            <FaPaperPlane className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chatpanel;
