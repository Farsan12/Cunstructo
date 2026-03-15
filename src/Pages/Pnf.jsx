import React from 'react'
import { useNavigate } from 'react-router-dom'

function Pnf() {
    const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 animate-fadeIn"
      style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)" }}>

      {/* Illustration */}
      <div className="relative mb-6 animate-float">
        <div className="text-[100px] font-black tracking-tighter gradient-text select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full opacity-20 animate-glowPulse"
            style={{ background: "radial-gradient(circle, #1877F2, transparent)" }} />
        </div>
      </div>

      <p className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</p>
      <p className="text-gray-400 text-base mb-8 max-w-sm">
        Oops! The page you are looking for doesn&apos;t exist or has been moved.
      </p>

      <button
        onClick={() => navigate('/')}
        className="px-8 py-3 rounded-xl text-white font-bold text-base tracking-wide transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
        style={{
          background: "linear-gradient(135deg, #1877F2, #42a5f5)",
          boxShadow: "0 4px 18px rgba(24,119,242,0.4)"
        }}>
        ← Go Back Home
      </button>
    </div>
  )
}

export default Pnf
