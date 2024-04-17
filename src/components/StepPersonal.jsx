import { update } from "firebase/database";
import React from "react";

const StepPersonal = ({ formData, setFormData }) => {
    return (
        <div className=" grid gap-10 m-5">
            <div className="flex flex-col md:flex-row md:gap-10">
                <div className="flex flex-col w-full md:w-1/2 gap-2">
                    <label className="text-gray-600 dark:text-gray-400">Name</label>
                    <input
                        type="text"
                        placeholder="Name"
                        className="h-12 p-4 rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.personalInfo.name}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                personalInfo: {
                                    ...formData.personalInfo,
                                    name: event.target.value
                                }
                            })
                        }
                    />
                </div>

                <div className="flex flex-col w-full md:w-1/2 gap-2">
                    <label className="text-gray-600 dark:text-gray-400">Last name</label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="h-12 p-4 rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.personalInfo.lastName}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                personalInfo: {
                                    ...formData.personalInfo,
                                    lastName: event.target.value
                                }
                            })
                        }
                    />
                </div>



            </div>

            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                <div className="flex flex-col w-full md:w-1/2 gap-2">
                    <label className="text-gray-600 dark:text-gray-400">Phone Number</label>
                    <input
                        type="number"
                        placeholder="Phone Number"
                        className="h-12 p-4 rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.personalInfo.phoneNumber}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                personalInfo: {
                                    ...formData.personalInfo,
                                    phoneNumber: event.target.value
                                }
                            })
                        }
                    />
                </div>

                <div className="flex flex-col w-full md:w-1/2 gap-2">
                    <label className="text-gray-600 dark:text-gray-400">Birthdate</label>
                    <input
                        type="date"
                        placeholder="Birthdate"
                        className="h-12 p-4 rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.personalInfo.birthDate}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                personalInfo: {
                                    ...formData.personalInfo,
                                    birthDate: event.target.value
                                }
                            })
                        }
                    />
                </div>

                <div className="flex flex-col w-full  md:w-1/2 gap-2">
                    <label className="text-gray-600 dark:text-gray-400">Gender</label>
                    <select className="h-12 p-4 rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                    value={formData.personalInfo.gender}
                    onChange={(event) =>
                        setFormData({
                            ...formData,
                            personalInfo: {
                                ...formData.personalInfo,
                                gender: event.target.value
                            }
                        })
                    }>
                        <option value="feminine">Feminine</option>
                        <option value="masculine">Masculine</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
        </div>

    )
}

export default StepPersonal;
