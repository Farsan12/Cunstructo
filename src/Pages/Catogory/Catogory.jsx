import React from "react";
import CatCard from "../../Componets/CatCard";

function Category() {
    return (
        <div className="max-w-7xl mx-auto mt-8 px-6">
            {/* Section Header */}
            <div className="flex justify-between items-end mb-6 animate-slideUp">
                <div>
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">Browse</p>
                    <h2 className="text-3xl font-bold text-gray-900 section-title">Categories</h2>
                </div>
            </div>

            {/* Choose Text */}
            <p className="text-gray-500 text-base mb-6 animate-slideUp delay-100">Choose a category to find skilled workers near you:</p>

            {/* Category Cards */}
            <div className="animate-fadeIn delay-200">
                <CatCard />
            </div>
        </div>
    );
}

export default Category;
