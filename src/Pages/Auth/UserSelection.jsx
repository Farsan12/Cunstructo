import React from 'react';
import { Link } from 'react-router-dom';

function UserSelection() {
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-screen"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d47c8 40%, #1877F2 70%, #42a5f5 100%)" }}>

      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute animate-float w-[280px] h-[280px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #90caf9, transparent)", top: "-60px", left: "-80px" }} />
        <div className="absolute animate-float delay-300 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #1565c0, transparent)", bottom: "-120px", right: "-100px" }} />
        <div className="absolute animate-float delay-200 w-[180px] h-[180px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #42a5f5, transparent)", top: "40%", left: "10%" }} />
        {/* Rotating ring */}
        <div className="absolute w-[600px] h-[600px] rounded-full animate-spinSlow opacity-10"
          style={{
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            border: "2px solid rgba(255,255,255,0.4)"
          }} />
        <div className="absolute w-[420px] h-[420px] rounded-full animate-spinSlow delay-300 opacity-10"
          style={{
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            border: "2px solid rgba(255,255,255,0.3)",
            animationDirection: "reverse"
          }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      {/* Card */}
      <div className="relative z-10 animate-scaleIn flex flex-col items-center space-y-8 px-10 py-12 rounded-3xl"
        style={{
          background: "rgba(255,255,255,0.11)",
          backdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.22)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
          minWidth: "340px"
        }}>

        {/* Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-glowPulse"
            style={{ background: "linear-gradient(145deg, #1565c0, #1877F2, #42a5f5)", boxShadow: "0 8px 28px rgba(24,119,242,0.55)" }}>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18h18v2.5H3V18z" fill="white" />
              <path d="M12 3C7.58 3 4 6.8 4 11.5V18h16v-6.5C20 6.8 16.42 3 12 3z" fill="white" fillOpacity="0.92" />
              <path d="M10.5 5v8M13.5 5v8" stroke="rgba(21,101,192,0.5)" strokeWidth="1.4" strokeLinecap="round" />
              <rect x="9" y="2" width="6" height="2.5" rx="1.25" fill="white" />
            </svg>
          </div>
          <span className="text-white font-black text-xl tracking-widest opacity-90">CONSTRUCTO</span>
          <h1 className="text-2xl font-bold text-white text-center tracking-tight">Choose Your Role</h1>
          <p className="text-blue-200 text-sm text-center">Select how you want to use the platform</p>
        </div>

        {/* Role Cards */}
        <div className="flex space-x-5 w-full justify-center">
          <Link to="/workersignup" className="flex-1 max-w-[150px]">
            <button className="w-full h-[4.5rem] rounded-2xl text-white font-bold text-base tracking-wide transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95 flex flex-col items-center justify-center gap-1.5"
              style={{
                background: "linear-gradient(145deg, #1565c0, #1877F2)",
                boxShadow: "0 4px 18px rgba(24,119,242,0.5)"
              }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Worker
            </button>
          </Link>
          <Link to="/usersignup" className="flex-1 max-w-[150px]">
            <button className="w-full h-[4.5rem] rounded-2xl font-bold text-base tracking-wide transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95 flex flex-col items-center justify-center gap-1.5"
              style={{
                background: "rgba(255,255,255,0.92)",
                color: "#1877F2",
                boxShadow: "0 4px 18px rgba(255,255,255,0.2)"
              }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User
            </button>
          </Link>
        </div>

        <p className="text-blue-300 text-xs text-center">Already have an account?{' '}
          <Link to="/login" className="text-white font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default UserSelection;
