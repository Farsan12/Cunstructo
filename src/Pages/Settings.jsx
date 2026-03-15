import React, { useState, useEffect, useContext } from 'react';
import { FaSignOutAlt, FaCog, FaUser, FaBan, FaCommentDots, FaShieldAlt, FaEllipsisH, FaQuestionCircle } from "react-icons/fa";
import Header from '../Componets/Header';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { displayProfileContext } from '../Context/OtherPurpuseContextApi';
import serverUrl from '../services/serverUrl';
import proflieimg from '../assets/profileimg/profileimg.webp'

function Settings() {

    const {profileResponse}=useContext(displayProfileContext)
    const navigate = useNavigate();
    const location = useLocation();

    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [profile,setprofile]=useState()

    useEffect(() => {
      setprofile(profileResponse)
    }, [profileResponse])
    

    useEffect(() => {
        if (location.pathname === "/settings") {
            navigate("/settings/profile");
        }
    }, [location.pathname, navigate]);

    const handilLogout=()=>{
        localStorage.clear()
        navigate('/')
    }


    return (
        <div className="h-screen flex flex-col" style={{ background: "#f0f4ff" }}>
            <Header />

            <div className="flex-1 relative overflow-hidden">
                <div className="flex flex-col md:flex-row h-full">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden rounded-br-lg rounded-tr-lg mt-2 py-2 px-3 text-white fixed z-20 shadow-lg"
                        style={{ background: "linear-gradient(135deg, #1877F2, #42a5f5)" }}
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                    >
                        <i className={`fa-solid ${isSidebarOpen ? "fa-caret-left" : "fa-caret-right"}`}></i>
                    </button>

                    {/* Left Sidebar */}
                    <div className={`absolute md:relative w-64 transform overflow-auto h-full md:w-1/3 lg:w-1/4 
                        transition-transform duration-300 z-10 ${ isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
                        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderRight: "1px solid #e0e8ff" }}>

                        <div className="p-6 flex flex-col items-center border-b" style={{ borderColor: "#e0e8ff" }}>
                            {/* Profile Picture */}
                            <label className='w-fit cursor-pointer mb-4 relative'>
                                <img
                                    className={profile?.profilepic ? "w-[100px] h-[100px] object-cover rounded-full border-4 shadow-md" : "w-[100px] h-[100px] object-cover p-3 rounded-full border-4 shadow-md"}
                                    style={{ borderColor: "#bfdbfe" }}
                                    src={profile?.profilepic ? `${serverUrl}/uploads/${profile?.profilepic}` : proflieimg}
                                    alt="Profile"
                                />
                                <div className="absolute bottom-2 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow"
                                    style={{ background: "#1877F2" }}>
                                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-2.207 2.207L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </div>
                            </label>
                            <h3 className="text-base font-bold text-gray-800">{profile?.username}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{profile?.email}</p>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="p-3 space-y-1">
                            {[
                                { to: '/settings/profile', icon: FaUser, label: 'Profile' },
                                { to: '/settings/security&password', icon: FaShieldAlt, label: 'Security & Privacy' },
                                { to: '/settings/feedbackuser', icon: FaCommentDots, label: 'Feedback' },
                                { to: '/settings/help', icon: FaQuestionCircle, label: 'Help' },
                            ].map(({ to, icon: Icon, label }) => (
                                <NavLink key={to} to={to} className={({ isActive }) =>
                                    `w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? 'text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                                    style={({ isActive }) => isActive ? {
                                        background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
                                        borderLeft: "3px solid #1877F2"
                                    } : {}}>
                                    <Icon className="text-base" />
                                    {label}
                                </NavLink>
                            ))}
                            <hr className="my-2" style={{ borderColor: "#e0e8ff" }} />
                            <button
                                onClick={() => handilLogout()}
                                className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-50 rounded-xl transition-all duration-200">
                                <FaSignOutAlt />
                                Logout
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className='flex-1 md:mt-8 w-full overflow-auto p-6 animate-fadeIn'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
