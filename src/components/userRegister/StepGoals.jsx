import React from "react";

const StepsGoals = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            readingGoals: {
                ...prevState.readingGoals,
                [name]: value
            }
        }));
    };


    return (
        <div className="flex flex-col gap-4 m-10 items-center justify-center flex-wrap">
            <h2 className="text-2xl text-center mb-6 text-gray-300">What are your reading goals for the year?</h2>
            <div className="flex flex-col md:flex-row gap-7">
                <div className="flex flex-col w-full md:w-1/3 gap-2 items-center">
                    <label className="text-gray-700 flex items-center" >
                        📚
                        Daily reading (min)
                    </label>
                    <input
                        type="number"
                        placeholder="10 minutes"
                        name="dailyReading"
                        className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.readingGoals.dailyReading}
                        onChange={handleChange}
                    />

                </div>
                <div className="flex flex-col w-full md:w-1/3 gap-2 items-center">
                    <label className="text-gray-700 flex items-center">
                        📅
                        Books per year
                    </label>
                    <input
                        type="number"
                        placeholder="10 books"
                        name="booksPerYear"
                        className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.readingGoals.booksPerYear}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col w-full md:w-1/3 gap-2 items-center">
                    <label className="text-gray-700 flex items-center">
                        🏷️
                        Different genres
                    </label>
                    <input
                        type="number"
                        placeholder="5 different genres"
                        name="diffGenres"
                        className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.readingGoals.diffGenres}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default StepsGoals;