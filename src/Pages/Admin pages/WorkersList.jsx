import React, { useEffect, useState } from "react";
import { Trash2, Ban } from "lucide-react";
import { deleteUserApi, getAllworkerApi, updateBlockApi } from "../../services/allApi";
import serverUrl from "../../services/serverUrl";
import profileimg from "../../assets/profileimg/profileimg.webp"
import { toast } from "react-toastify";

function WorkersList() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    getAllworkers()
  }, [])

  const getAllworkers = async () => {
    try {
      const result = await getAllworkerApi()
      setWorkers(result.data)
    } catch (error) {
      console.log(error);

    }
  }


  const handleDeleteWorker =async (id) => {
    try {
      const result=await deleteUserApi(id)

      if(result.status>=200&&result.status<=299){
        toast.warning("removed worker!!")
        getAllworkers()

       }
    } catch (error) {
      console.log(error);
      
    }
  };

  const handleBlockWorker =async (id) => {
    try {
      const result = await updateBlockApi(id,{block:true})
      if(result.status==200){
        toast.warning("temparory blocked")
        getAllworkers()
      }
    } catch (error) {
      console.log(error);
      
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-slideUp">
      <div className="mb-6">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Admin</p>
        <p className="text-2xl font-bold text-gray-800 section-title">Workers List</p>
      </div>
      {workers.length > 0 ? (
        <div className="flex flex-col gap-3">
          {workers.map((worker, index) => (
            <div key={worker._id || index} className="flex items-center justify-between p-4 rounded-2xl transition-all animate-fadeIn"
              style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 10px rgba(24,119,242,0.07)", animationDelay: `${index * 40}ms` }}>
              <div className="flex items-center gap-3">
                <img src={worker.profilepic ? `${serverUrl}/uploads/${worker.profilepic}` : profileimg} alt={worker.username}
                  className={`w-12 h-12 rounded-full object-cover ${!worker.profilepic ? "p-2 bg-blue-50" : ""}`}
                  style={{ border: "2px solid #bfdbfe" }} />
                <div>
                  <p className="font-semibold text-gray-800">{worker.email}</p>
                  <p className="text-gray-400 text-xs truncate max-w-[180px]">{Array.isArray(worker.skills) ? worker.skills.join(", ") : worker.skills}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleBlockWorker(worker._id)}
                  className={`p-2.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95 ${worker.blocked ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  <Ban size={16} />
                </button>
                <button onClick={() => handleDeleteWorker(worker._id)}
                  className="p-2.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #ef4444, #f87171)", boxShadow: "0 2px 8px rgba(239,68,68,0.3)" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 gap-3 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.7)", border: "1.5px dashed #bfdbfe" }}>
          <i className="fa-solid fa-hard-hat text-blue-300 text-4xl"></i>
          <p className="text-gray-500 font-medium">No workers found</p>
        </div>
      )}
    </div>
  );
}

export default WorkersList;
