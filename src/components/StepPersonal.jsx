import React from "react";


const StepPersonal = () => {
    return (
        <>
            <div className="flex gap-4">
                        <div className="flex flex-col w-1/2 gap-2">
                            <label className="text-gray-600 dark:text-gray-400">Name</label>
                            <input type="text" placeholder="Name" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                        </div>
                        <div className="flex flex-col w-1/2 gap-2">
                            <label className="text-gray-600 dark:text-gray-400">Last name</label>
                            <input type="text" placeholder="LastName" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2 gap-2">
                            <label className="text-gray-600 dark:text-gray-400">Birthday</label>
                            <input type="date" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                        </div>
                        <div className="flex flex-col w-1/2 gap-2">
                            <label className="text-gray-600 dark:text-gray-400">Phone number</label>
                            <input type="number" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                        </div>
                    </div>
        </>
    )
}

export default StepPersonal;