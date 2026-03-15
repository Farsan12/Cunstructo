import React from 'react'
import Header from '../Componets/Header'
import Category from './Catogory/Catogory'
import Curosal from '../Componets/Curosal'
import Footer from '../Componets/Footer'

function Dashbord() {
  return (
    <div className='min-h-screen flex flex-col' style={{ background: "#f0f4ff" }}>
      <Header />

      {/* Hero micro-strip */}
      <div className="w-full animate-slideDown"
        style={{
          background: "linear-gradient(135deg, #0d47c8 0%, #1877F2 60%, #42a5f5 100%)",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <p className="text-white/90 text-sm font-medium tracking-wide">
          🔨 Find skilled workers near you — fast, reliable & trusted
        </p>
      </div>

      <div className='flex-1 pb-10'>
        {/* Carousel with rounded corners wrapper */}
        <div className="mt-6 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
          <div className="rounded-2xl overflow-hidden shadow-lg"
            style={{ boxShadow: "0 8px 32px rgba(24,119,242,0.18)" }}>
            <Curosal />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-8">
          <Category />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashbord