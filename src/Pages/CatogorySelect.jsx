import React, { useEffect, useState } from 'react';
import Header from '../Componets/Header';
import WorkerCard from '../Componets/WorkerCard';
import { FaSearch } from "react-icons/fa";
import Footer from '../Componets/Footer';
import { useLocation } from 'react-router-dom';
import { searchCategoryApi } from '../services/allApi';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

function CategorySelect() {

  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState('');
  const [unavailableCatogryfield, setunavailableCatogryfield] = useState([])
  const [availableCatogryfield, setavailableCatogryfield] = useState([])
  // Show more states
  const [availableLimit, setAvailableLimit] = useState(8);
  const [unavailableLimit, setUnavailableLimit] = useState(8);
  const [showMessage, setShowMessage] = useState(false);

  const query = useQuery();
  const field = query.get("field");

  useEffect(() => {
    if (field) {
      fileterdCategory(field);
    }
  }, [field, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  const fileterdCategory = async (field) => {
    if (token) {

      const reqheader = {
        "content-type": "application/json",
        "authorization": `Bearer ${token}`
      }

  
      try {
        const result = await searchCategoryApi(searchTerm ? searchTerm : field, reqheader)
        setavailableCatogryfield(result.data.filteredAvailableUsers)
        setunavailableCatogryfield(result.data.filteredUnavailableUsers)
        setAvailableLimit(4); // Reset limits on new search
        setUnavailableLimit(4);
      } catch (error) {
        console.log(error);

      }

    }


  }


  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f0f4ff" }}>
      <Header />

      <div className="flex-1">
        {/* Search Bar */}
        <div className="flex justify-center pt-8 pb-4 px-4 animate-slideDown"
          style={{
            background: "linear-gradient(180deg, #e8f0fe 0%, #f0f4ff 100%)"
          }}>
          <div className="relative w-full sm:w-[80%] md:w-[60%] lg:w-[50%]">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="Search for workers..."
              className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-white focus:outline-none transition-all duration-200 input-glow"
              style={{
                border: "1.5px solid #c7d7fa",
                boxShadow: "0 4px 20px rgba(24,119,242,0.12)"
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Worker Lists */}
        <div className="max-w-7xl mx-auto px-4 mt-4">

          {/* Available */}
          <div className="mb-8 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <h2 className="text-lg font-bold text-gray-800">Available Workers</h2>
            </div>
            <div className="w-full">
              {availableCatogryfield?.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {availableCatogryfield.slice(0, availableLimit).map((worker, index) => (
                    <div key={index} className="animate-scaleIn" style={{ animationDelay: `${index * 0.06}s`, animationFillMode: "both" }}>
                      <WorkerCard filterdWorker={worker} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center my-10 flex items-center justify-center">
                  {showMessage ? (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#e8f0fe" }}>
                        <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No available workers at this time</p>
                    </div>
                  ) : (
                    <span className="loading loading-dots text-blue-400 loading-xl"></span>
                  )}
                </div>
              )}
            </div>
            {availableCatogryfield.length > availableLimit && (
              <p
                className="text-end text-blue-600 cursor-pointer hover:underline mt-3 font-medium text-sm"
                onClick={() => setAvailableLimit(prev => prev + 4)}
              >
                See More →
              </p>
            )}
          </div>

          {/* Unavailable */}
          <div className="mb-8 animate-slideUp delay-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-gray-300" />
              <h2 className="text-lg font-bold text-gray-500">Unavailable Workers</h2>
            </div>
            <div className="w-full">
              {unavailableCatogryfield?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {unavailableCatogryfield.slice(0, unavailableLimit).map((worker, index) => (
                    <div key={index} className="animate-scaleIn opacity-70" style={{ animationDelay: `${index * 0.06}s`, animationFillMode: "both" }}>
                      <WorkerCard filterdWorker={worker} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center my-4">
                  {showMessage ? (
                    <p className="text-gray-400 text-sm">No unavailable workers listed</p>
                  ) : (
                    <span className="loading loading-dots text-gray-400 loading-xl"></span>
                  )}
                </div>
              )}
            </div>
            {unavailableCatogryfield.length > unavailableLimit && (
              <p
                className="text-end text-blue-400 cursor-pointer hover:underline mt-3 font-medium text-sm"
                onClick={() => setUnavailableLimit(prev => prev + 4)}
              >
                See More →
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CategorySelect;
