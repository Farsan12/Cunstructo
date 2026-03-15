import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../Componets/Header";


const AdminDashboard = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);


    useEffect(() => {
        if (location.pathname === "/admindashbord") {
            navigate("/admindashbord/addcatogory");
        }
    }, [location.pathname, navigate]);

    return (
        <div className="min-h-screen overflow-hidden" style={{ background: "#f0f4ff" }}>
            <div className="fixed w-full z-50">
                <Header />
            </div>
            <div className="relative max-w-7xl pt-[72px]">
                {/* Sidebar */}
                <div className={`fixed z-40 flex bg-black/20 md:bg-transparent md:h-fit h-screen transition-all duration-300 md:w-full ${sidebarOpen ? "w-72" : "w-0 overflow-hidden"}`}>
                    <div className="flex gap-3 shadow-xl h-full md:w-screen p-4"
                        style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid #e0e8ff" }}>
                        <nav className="flex md:flex-row lg:gap-3 md:gap-1 gap-2 w-fit mx-auto md:justify-center flex-col md:mt-0 mt-16">
                            {[
                                { to: '/admindashbord/addcatogory', emoji: '📂', label: 'Add Category' },
                                { to: '/admindashbord/add_adds', emoji: '📢', label: 'Change Ad' },
                                { to: '/admindashbord/userlist', emoji: '👤', label: 'Users' },
                                { to: '/admindashbord/workerlist', emoji: '🔧', label: 'Workers' },
                                { to: '/admindashbord/feedbacklist', emoji: '📝', label: 'Feedbacks' },
                                { to: '/admindashbord/blocklist', emoji: '🚫', label: 'Blocked' },
                                { to: '/admindashbord/paymenthistory', emoji: '💳', label: 'Payments' },
                            ].map(({ to, emoji, label }) => (
                                <NavLink key={to} to={to} className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                                        isActive
                                            ? 'text-blue-600 shadow-md'
                                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-100'
                                    }`}
                                    style={({ isActive }) => isActive ? {
                                        background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
                                        border: "1.5px solid #bfdbfe"
                                    } : {}}>
                                    <span className="text-xl">{emoji}</span>
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                            <button></button>
                        </nav>
                        {/* Close Button for mobile */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 h-12 rounded-lg text-white md:hidden transition-colors"
                            style={{ background: "#1877F2" }}>
                            <ChevronRight size={22} />
                        </button>
                    </div>
                </div>

                {/* Sidebar Toggle for mobile */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="fixed md:hidden mt-2 p-2 h-10 rounded-r-xl shadow-lg text-white transition-all"
                    style={{ background: "#1877F2", top: "72px" }}>
                    <ChevronLeft size={22} />
                </button>
            </div>

            {/* Main Content */}
            <div className="p-6 w-full animate-fadeIn" style={{ paddingTop: "96px" }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;