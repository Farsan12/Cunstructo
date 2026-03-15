import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import { io } from "socket.io-client";
import serverUrl from '../services/serverUrl';
import { reciverIdContext } from './OtherPurpuseContextApi';

export const displayUserOnlineOrOflineContext = createContext([])

function SocketioContext({ children }) {

    const socketRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const context = useContext(reciverIdContext) || {};
  
    const [onlineusersResponse, setOnlineusersResponse] = useState([]);
    const [isonlineworker, setonlineworker] = useState()
    const [messages, setMessages] = useState([])
   
    console.log(isonlineworker);

    useEffect(() => {
        if (!user?._id) return;
    
        if (socketRef.current) {
            socketRef.current.disconnect(); // kill any existing socket
        }
    
        socketRef.current = io(serverUrl, {
            transports: ["websocket"],
            query: { userid: user._id }
        });
    
        const socket = socketRef.current;
    
        socket.on("connect", () => {
            console.log("✅ Connected to socket.io server with id:", socket.id);
        });
    
        socket.on("getOnlineusers", (userids) => {
            setOnlineusersResponse(userids);
        });
    
        socket.on("newMessage", (message) => {
            console.log("📩 Received new message from socket:", message);
            setMessages((prev) => [...prev, message]);
          });

        //   console.log("Sending socket message to:", reciverSocketId);

        socket.on("disconnect", () => {
            console.log("❌ Disconnected from socket.io server");
        });
    
        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });
    
        return () => {

            socket.disconnect();
        };
    }, [user?._id]);
    


    console.log(onlineusersResponse, "onlineu u");

    useEffect(() => {
        socketRef.current?.onAny((event, ...args) => {
            console.log("📡 Event received:", event, args);
        });
    }, [])

    return (
        <displayUserOnlineOrOflineContext.Provider value={{ setOnlineusersResponse, onlineusersResponse, isonlineworker, setonlineworker ,messages, setMessages}}>
            {children}
        </displayUserOnlineOrOflineContext.Provider>
    )
}

export default SocketioContext