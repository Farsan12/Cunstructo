import React, { use, useContext, useEffect, useState } from 'react'
import { getSingleuserApi, updateProfileApi } from '../../services/allApi';
import serverUrl from '../../services/serverUrl';
import { displaycategoryContext ,displayProfileContext} from '../../Context/OtherPurpuseContextApi';
import profileimg from '../../assets/profileimg/profileimg.webp'
import { toast } from 'react-toastify';

function Profile() {


    const { setProfileResponse } = useContext(displayProfileContext)
    const { categoryResponse } = useContext(displaycategoryContext)

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"))

    const [profileData, setprofileData] = useState({})
    const [profileimage, setprofileimg] = useState()


    const Allcategory = categoryResponse.map(item => item.categoryname)

    useEffect(() => {
        getSingleuser()

    }, [])

    useEffect(() => {
        if (profileData.profilepic instanceof File) {
            setprofileimg(URL.createObjectURL(profileData.profilepic));
        } 
        
        else if ( profileData.profilepic ) {
            setprofileimg(`${serverUrl}/uploads/${profileData.profilepic}`);
        }
        else if (profileData.profilepic == " ") {
            setprofileimg(URL.createObjectURL(profileimg))
        }
        
    }, [profileData.profilepic]);

    const getSingleuser = async () => {

        const reqheader = {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }

        try {
            const result = await getSingleuserApi(reqheader)
            setprofileData(result.data)
            setProfileResponse(result.data)



        } catch (error) {
            console.log(error);

        }
    }

    const handileUpdateprofile = async () => {

        const { username, dob, mobileno, gender, location, skills, experience, status, profilepic } = profileData;

        const reqBody = new FormData();
        reqBody.append("username", username);
        reqBody.append("dob", dob);
        reqBody.append("mobileno", mobileno);
        reqBody.append("gender", gender);
        reqBody.append("location", location);  // fixed typo "loacation"
        reqBody.append("skills", JSON.stringify(skills)); // convert to string if array
        reqBody.append("experience", experience);
        reqBody.append("status", status);
        reqBody.append("profilepic", profilepic);

        if (token) {
            const reqheader = {

                "authorization": `Bearer ${token}`
            }

            try {
                const result = await updateProfileApi(reqBody, reqheader)

                
                
                if(result.status>=200&&result.status<300){
                    toast.success(result.data.message)
                    // Update localStorage so header/other components see the new photo immediately
                    const updatedUser = result.data.data;
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    getSingleuser()
                    setProfileResponse(updatedUser)
                }
                else{
                    

                    toast.warning(result.response.data.message)
                }
                

            } catch (error) {
                console.log(error);

            }
        }
    }

    return (
        <div className="animate-slideUp">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 md:mt-0 mt-4">
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Account</p>
                    <p className="text-2xl font-bold text-gray-800 section-title">Profile Settings</p>
                </div>

                <form className="space-y-4 px-4">
                    {/* Profile Picture */}
                    <div className="flex justify-center">
                        <label htmlFor="profilepic" className="relative cursor-pointer inline-block w-[110px] h-[110px]">
                            <input id="profilepic" type="file" className="hidden" onChange={(e) => setprofileData({ ...profileData, profilepic: e.target.files[0] })} />
                            <img
                                className={profileimage ? "w-full h-full border-4 rounded-full object-cover shadow-lg" : "w-full h-full border-4 rounded-full p-3 object-cover shadow-lg"}
                                style={{ borderColor: "#bfdbfe" }}
                                src={profileimage || profileimg}
                                alt="Profile"
                            />
                            <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                                style={{ background: "#1877F2" }}>
                                <i className="fa-solid fa-plus text-white text-xs"></i>
                            </div>
                        </label>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
                        <input
                            id="fullName"
                            value={profileData?.username || ""}
                            type="text"
                            onChange={(e) => setprofileData({ ...profileData, username: e.target.value })}
                            className="w-full p-3 rounded-xl focus:outline-none input-glow transition-all"
                            style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Mobile + DOB */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="mobile" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Mobile Number</label>
                            <input
                                value={profileData?.mobileno || ""}
                                id="mobile"
                                type="tel"
                                onChange={(e) => setprofileData({ ...profileData, mobileno: e.target.value })}
                                className="w-full p-3 rounded-xl focus:outline-none input-glow transition-all"
                                style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div>
                            <label htmlFor="dob" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date of Birth</label>
                            <input
                                id="dob"
                                type="date"
                                value={profileData?.dob || ""}
                                onChange={(e) => setprofileData({ ...profileData, dob: e.target.value })}
                                className="w-full p-3 rounded-xl focus:outline-none input-glow transition-all"
                                style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <fieldset>
                                <legend className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Gender</legend>
                                <div className="flex flex-wrap gap-4">
                                    {['male', 'female', 'other'].map((gender) => (
                                        <label key={gender} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={gender}
                                                checked={profileData?.gender === gender}
                                                onChange={(e) => setprofileData({ ...profileData, gender: e.target.value })}
                                                className="h-4 w-4 accent-blue-600"
                                            />
                                            <span className="capitalize text-sm text-gray-700">{gender}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    {/* Worker-specific fields */}
                    {user.roll === "worker" && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="location" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    value={profileData?.location || ""}
                                    name="location"
                                    onChange={(e) => setprofileData({ ...profileData, location: e.target.value })}
                                    className="w-full p-3 rounded-xl focus:outline-none input-glow transition-all"
                                    style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                                    placeholder="Enter your location"
                                />
                            </div>
                            <fieldset>
                                <legend className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</legend>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {Allcategory.map((skill) => (
                                        <label key={skill} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={profileData?.skills?.includes(skill) || false}
                                                className="accent-blue-600 w-3.5 h-3.5"
                                                onChange={(e) => {
                                                    var updatedSkills = e.target.checked
                                                        ? [...(profileData?.skills || []), skill]
                                                        : (profileData?.skills || []).filter((s) => s !== skill);
                                                    setprofileData({ ...profileData, skills: updatedSkills });
                                                }}
                                            />
                                            <span>{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="experience" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Experience (years)</label>
                                    <input
                                        id="experience"
                                        type="number"
                                        value={profileData.experience || ""}
                                        className="w-full p-3 rounded-xl focus:outline-none input-glow transition-all"
                                        style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                                        min="0"
                                        onChange={(e) => setprofileData({ ...profileData, experience: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="availability" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
                                    <select
                                        id="availability"
                                        value={profileData?.status || ""}
                                        onChange={(e) => setprofileData({ ...profileData, status: e.target.value })}
                                        className="w-full p-3 rounded-xl focus:outline-none input-glow transition-all"
                                        style={{ border: "1.5px solid #c7d7fa", background: "#f8faff" }}
                                    >
                                        <option value="available">Available</option>
                                        <option value="unavailable">Unavailable</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handileUpdateprofile}
                        type="button"
                        className="w-full mt-4 py-3 px-6 rounded-xl text-white font-bold tracking-wide transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-95"
                        style={{ background: "linear-gradient(135deg, #1877F2, #42a5f5)", boxShadow: "0 4px 16px rgba(24,119,242,0.4)" }}
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile