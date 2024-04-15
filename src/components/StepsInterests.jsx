import React from "react";

const StepsInterests = () => {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col w-1/2 gap-2">
                <label className="text-gray-600 dark:text-gray-400">Nombre</label>
                <input type="text" placeholder="Nombre" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
            </div>
            <div className="flex flex-col w-1/2 gap-2">
                <label className="text-gray-600 dark:text-gray-400">Apellido</label>
                <input type="text" placeholder="Apellido" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
            </div>
        </div>

    )
}