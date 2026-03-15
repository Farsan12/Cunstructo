import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { displaycategoryContext } from "../Context/OtherPurpuseContextApi";
import serverUrl from "../services/serverUrl";
import { toast } from "react-toastify";

function CatCard() {
  const { categoryResponse } = useContext(displaycategoryContext);



  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 10000);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  const handleCheckToken = (navigateUrl) => {

    if (token) {
      if(user.roll=="admin"){
        return
      }
      else{
        navigate(navigateUrl);
      }
      
    } else {
      toast.warning("Please login to access this category.");
      navigate("/login"); // Redirect to login page
    }
  };

  return (
    <div>
      {categoryResponse?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-5">
          {categoryResponse.map((item, idx) => (
            <div
              key={item._id}
              onClick={() => handleCheckToken(`/catogoryselect?field=${item.categoryname}`)}
              className="animate-scaleIn group relative overflow-hidden rounded-2xl cursor-pointer card-hover"
              style={{
                animationDelay: `${idx * 0.07}s`,
                animationFillMode: 'both',
                background: "linear-gradient(145deg, #1877F2, #0d47c8)",
                boxShadow: "0 4px 20px rgba(24,119,242,0.3)"
              }}
            >
              {/* Shimmer overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />

              <div className="p-6 flex flex-col items-center">
                {/* Image ring */}
                <div className="relative mb-3">
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-glowPulse"
                    style={{ background: "rgba(255,255,255,0.2)", transform: "scale(1.1)" }} />
                  <div className="w-28 h-28 rounded-full bg-white p-1 shadow-xl">
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={`${serverUrl}/uploads/${item.categoryimg}`}
                      alt={item.categoryname}
                      onError={(e) => (e.target.src = "/fallback-image.png")}
                    />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white text-center leading-tight px-1 group-hover:text-blue-100 transition-colors">
                  {item.categoryname}
                </h3>
              </div>

              {/* Bottom accent */}
              <div className="h-1 w-0 group-hover:w-full transition-all duration-400 mx-0"
                style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.7), transparent)" }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center my-8">
          {showMessage ? (
            <p className="text-lg text-gray-500">No categories available. Please check back later.</p>
          ) : (
            <span className="loading loading-dots text-blue-400 loading-xl"></span>
          )}
        </div>
      )}
    </div>
  );
}

export default CatCard;
