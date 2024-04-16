import React from "react";

const StepsGoals = () => {
    return (
            <div className="flex flex-col gap-4 items-center justify-center">
                <h2 className="text-2xl text-center mb-6 text-gray-700">What are your reading goals for the year?<span className='text-black'>.</span></h2>
                <div className="flex flex-col md:flex-row gap-7">
                    <div className="flex flex-col w-full md:w-1/3 gap-2 items-center">
                        <label className="text-gray-700 flex items-center" >
                            📚
                            Books per year
                        </label>
                        <input type="number" placeholder="10" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                    </div>
                    <div className="flex flex-col w-full md:w-1/3 gap-2 items-center">
                        <label className="text-gray-700 flex items-center">
                            📅
                            Pages per month
                        </label>
                        <input type="number" placeholder="3000" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                    </div>
                    <div className="flex flex-col w-full md:w-1/3 gap-2 items-center">
                        <label className="text-gray-700 flex items-center">
                            🏷️
                            Different genres
                        </label>
                        <input type="text" placeholder="3" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                    </div>
                </div>
            </div>
        
    )
}

export default StepsGoals;
