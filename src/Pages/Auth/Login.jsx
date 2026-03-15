import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLoginApi, LoginApi } from '../../services/allApi';
import { FaUser, FaLock } from "react-icons/fa";
import { toast } from 'react-toastify';
import { LoginUserContext } from '../../Context/OtherPurpuseContextApi';

function Login() {
    const navigate = useNavigate();
    const [logindata, setlogindata] = useState({ email: "", password: "" });
    const { setloginUserResposne } = useContext(LoginUserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = logindata;
        if (email && password) {
            try {
                // Try regular user/worker login first
                let result = await LoginApi(logindata);

                // If regular login fails, try admin login
                if (!(result.status >= 200 && result.status <= 299)) {
                    result = await AdminLoginApi(logindata);
                }

                if (result.status >= 200 && result.status <= 299) {
                    result.data.user.roll == "user" || result.data.user.roll == "worker"
                        ? navigate('/')
                        : navigate('/admindashbord');
                    localStorage.setItem("user", JSON.stringify(result.data.user));
                    localStorage.setItem("token", result.data.token);
                    setloginUserResposne(result);
                } else {
                    toast.warning(result.response?.data?.message || result.response?.data || "Invalid credentials");
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.warning("Please complete the form");
        }
    };

    return (
        <div className="min-h-screen overflow-y-auto relative flex justify-center items-center py-6"
            style={{
                background: "linear-gradient(135deg, #0a1628 0%, #0d47c8 40%, #1877F2 70%, #42a5f5 100%)"
            }}>

            {/* Animated background orbs */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute animate-float w-[380px] h-[380px] rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #60a1fa, transparent)", top: "-100px", left: "-120px" }} />
                <div className="absolute animate-float delay-300 w-[500px] h-[500px] rounded-full opacity-15"
                    style={{ background: "radial-gradient(circle, #1877F2, transparent)", bottom: "-150px", right: "-150px" }} />
                <div className="absolute animate-float delay-200 w-[220px] h-[220px] rounded-full opacity-25"
                    style={{ background: "radial-gradient(circle, #90caf9, transparent)", bottom: "200px", left: "100px" }} />
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            </div>

            {/* Login Card */}
            <div className="relative z-10 animate-scaleIn w-[92%] sm:w-[420px] rounded-3xl p-8 shadow-2xl"
                style={{
                    background: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
                }}>

                {/* Logo */}
                <div className="flex flex-col items-center gap-2 mb-5">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-glowPulse"
                        style={{ background: "linear-gradient(145deg, #1565c0, #1877F2, #42a5f5)", boxShadow: "0 8px 28px rgba(24,119,242,0.55)" }}>
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 18h18v2.5H3V18z" fill="white" />
                            <path d="M12 3C7.58 3 4 6.8 4 11.5V18h16v-6.5C20 6.8 16.42 3 12 3z" fill="white" fillOpacity="0.92" />
                            <path d="M10.5 5v8M13.5 5v8" stroke="rgba(21,101,192,0.5)" strokeWidth="1.4" strokeLinecap="round" />
                            <rect x="9" y="2" width="6" height="2.5" rx="1.25" fill="white" />
                        </svg>
                    </div>
                    <span className="text-white font-black text-lg tracking-widest opacity-90">CONSTRUCTO</span>
                </div>

                <h2 className="text-3xl font-bold text-white text-center tracking-tight">Welcome back</h2>
                <p className="text-blue-200 text-center text-sm mt-1 mb-6">Sign in to your Constructo account</p>

                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    {/* Email */}
                    <div className="relative">
                        <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-blue-300 text-sm" />
                        <input
                            type="email"
                            placeholder="Email address"
                            autoComplete="username"
                            value={logindata.email}
                            onChange={(e) => setlogindata({ ...logindata, email: e.target.value })}
                            className="w-full py-3 pl-11 pr-4 rounded-xl text-white placeholder-blue-200 focus:outline-none transition-all duration-200 input-glow"
                            style={{
                                background: "rgba(255,255,255,0.12)",
                                border: "1px solid rgba(255,255,255,0.2)"
                            }}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-blue-300 text-sm" />
                        <input
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={logindata.password}
                            onChange={(e) => setlogindata({ ...logindata, password: e.target.value })}
                            className="w-full py-3 pl-11 pr-4 rounded-xl text-white placeholder-blue-200 focus:outline-none transition-all duration-200 input-glow"
                            style={{
                                background: "rgba(255,255,255,0.12)",
                                border: "1px solid rgba(255,255,255,0.2)"
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-1 rounded-xl text-white font-bold text-base tracking-wide transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
                        style={{
                            background: "linear-gradient(135deg, #1877F2, #42a5f5)",
                            boxShadow: "0 4px 16px rgba(24,119,242,0.5)"
                        }}>
                        Login
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.2)" }} />
                    <span className="text-blue-200 text-xs">OR</span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.2)" }} />
                </div>

                <p className="text-blue-200 text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link to={'/userSelection'} className="text-white font-bold hover:underline transition-colors">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
