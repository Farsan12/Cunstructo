import React, { useEffect, useState } from "react";
import {  Unlock } from "lucide-react";
import { getAllblockedUsersApi, updateBlockApi } from "../../services/allApi";
import { toast } from "react-toastify";

function BlockedList() {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [blockedWorkers, setBlockedWorkers] = useState([]);

  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllWorkers, setShowAllWorkers] = useState(false);

  useEffect(() => {
    getAllblockedUsers()
    getAllblockedWorkers()
  }, [])

  const getAllblockedUsers=async()=>{
    try {
      const result = await getAllblockedUsersApi({roll:"user"})
      setBlockedUsers(result.data)
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const getAllblockedWorkers=async()=>{
    
    try {
      const result = await getAllblockedUsersApi({roll:"worker"})
      setBlockedWorkers(result.data)
      
    } catch (error) {
      console.log(error);
      
    }
  }
  

  const handleUnblockUser =async (id) => {
    
    try {
      const result = await updateBlockApi(id,{block:false})
      if(result.status==200){
        toast.success("unblocked")
        getAllblockedUsers()
      }
    } catch (error) {
      console.log(error);
      
    }
  };



  const handleUnblockWorker = async(id) => {
    try {
      const result = await updateBlockApi(id,{block:false})
      if(result.status==200){
        getAllblockedWorkers()
        toast.success("unblocked")
      }
    } catch (error) {
      console.log(error);
      
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-slideUp">
      <div className="mb-6">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Admin</p>
        <p className="text-2xl font-bold text-gray-800 section-title">Blocked Accounts</p>
      </div>

      {/* Blocked Users */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Users</p>
        {blockedUsers.length > 0 ? (
          <>
            <div className="flex flex-col gap-2 max-h-72 overflow-auto">
              {(showAllUsers ? blockedUsers : blockedUsers.slice(0, 3)).map((user) => (
                <div key={user._id} className="flex justify-between items-center p-4 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #fde68a", boxShadow: "0 2px 8px rgba(245,158,11,0.08)" }}>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{user.username}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                  <button onClick={() => handleUnblockUser(user._id)}
                    className="p-2.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #22c55e, #4ade80)", boxShadow: "0 2px 8px rgba(34,197,94,0.3)" }}>
                    <Unlock size={15} />
                  </button>
                </div>
              ))}
            </div>
            {blockedUsers.length > 3 && (
              <button onClick={() => setShowAllUsers(!showAllUsers)}
                className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors">
                {showAllUsers ? "See Less ▲" : "See More ▼"}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-6 rounded-2xl text-gray-400 text-sm"
            style={{ background: "rgba(255,255,255,0.6)", border: "1.5px dashed #bfdbfe" }}>No blocked users.</div>
        )}
      </div>

      {/* Blocked Workers */}
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Workers</p>
        {blockedWorkers.length > 0 ? (
          <>
            <div className="flex flex-col gap-2 max-h-72 overflow-auto">
              {(showAllWorkers ? blockedWorkers : blockedWorkers.slice(0, 3)).map((worker, index) => (
                <div key={index} className="flex justify-between items-center p-4 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #fde68a", boxShadow: "0 2px 8px rgba(245,158,11,0.08)" }}>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{worker.username}</p>
                    <p className="text-gray-500 text-xs">{worker.email}</p>
                  </div>
                  <button onClick={() => handleUnblockWorker(worker._id)}
                    className="p-2.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #22c55e, #4ade80)", boxShadow: "0 2px 8px rgba(34,197,94,0.3)" }}>
                    <Unlock size={15} />
                  </button>
                </div>
              ))}
            </div>
            {blockedWorkers.length > 3 && (
              <button onClick={() => setShowAllWorkers(!showAllWorkers)}
                className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors">
                {showAllWorkers ? "See Less ▲" : "See More ▼"}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-6 rounded-2xl text-gray-400 text-sm"
            style={{ background: "rgba(255,255,255,0.6)", border: "1.5px dashed #bfdbfe" }}>No blocked workers.</div>
        )}
      </div>
    </div>
  );
}

export default BlockedList;
