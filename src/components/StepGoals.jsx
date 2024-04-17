import React from "react";

const StepsGoals = ({ formData, setFormData }) => {
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
                        className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.readingGoals.dailyReading}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                readingGoals: {
                                    ...formData.readingGoals,
                                    dailyReading: event.target.value
                                }
                            })
                        }
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
                        className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.readingGoals.booksPerYear}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                readingGoals: {
                                    ...formData.readingGoals,
                                    booksPerYear: event.target.value
                                }
                            })
                        }
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
                        className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.readingGoals.diffGenres}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                readingGoals: {
                                    ...formData.readingGoals,
                                    diffGenres: event.target.value
                                }
                            })
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default StepsGoals;
