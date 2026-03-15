import React, { useState ,useEffect} from "react";
import { Trash2, Ban } from "lucide-react";
import { deleteUserApi, getAllusersApi, updateBlockApi } from "../../services/allApi";
import serverUrl from "../../services/serverUrl";
import profileimg from "../../assets/profileimg/profileimg.webp"
import { toast } from "react-toastify";

function UsersList() {
    const [user, setUser] = useState([]);


    useEffect(() => {
      getAllusers()
    }, [])

    const getAllusers= async()=>{
        try {
           const result= await getAllusersApi()
           setUser(result.data)   
        } catch (error) {
            console.log(error);
            
        }
    }

    const handileBanuser =async(id)=>{
        
        try {
            const result = await updateBlockApi(id,{block:true})

            if(result.status==200){
                toast.error("temporary blocked")
                getAllusers()
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    
    const handleDeleteUser = async(id) => {

        try {
            const result = await deleteUserApi(id)
            console.log(result);
            if(result.status>=200&&result.status<=299){
                getAllusers()
                toast.error("removed user")
               }
            
        } catch (error) {
            console.log(error);
            
        }
        
    };


    return (
        <div className="w-full max-w-4xl mx-auto animate-slideUp">
            <div className="mb-6">
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Admin</p>
                <p className="text-2xl font-bold text-gray-800 section-title">User Details</p>
            </div>
            {user.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {user.map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-2xl transition-all animate-fadeIn"
                            style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #dce9ff", boxShadow: "0 2px 10px rgba(24,119,242,0.07)", animationDelay: `${index * 40}ms` }}>
                            <div className="flex items-center gap-3">
                                <img
                                    src={user.profilepic ? `${serverUrl}/uploads/${user.profilepic}` : profileimg}
                                    alt={user.username}
                                    className={`w-12 h-12 rounded-full object-cover ${!user.profilepic ? "p-2 bg-blue-50" : ""}`}
                                    style={{ border: "2px solid #bfdbfe" }}
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{user.username}</p>
                                    <p className="text-gray-500 text-xs">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handileBanuser(user._id)}
                                    className={`p-2.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95 ${user.blocked ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
                                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                                    <Ban size={16} />
                                </button>
                                <button onClick={() => handleDeleteUser(user._id)}
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
                    <i className="fa-solid fa-users text-blue-300 text-4xl"></i>
                    <p className="text-gray-500 font-medium">No users found</p>
                </div>
            )}
        </div>
    );
}

export default UsersList;