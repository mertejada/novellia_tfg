import { update } from "firebase/database";
import React from "react";
import { useMediaQueries } from '../../contexts/MediaQueries';

/**
 * 
 * @param {*} formData
 * @param {*} setFormData
 * @returns 
 */
const StepPersonal = ({ formData, setFormData }) => {
    const { isMobile } = useMediaQueries();

    /**
     * Handle form input change
     * @param {*} e 
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            personalInfo: {
                ...prevState.personalInfo,
                [name]: value
            }
        }));
    };

 
    return (
        <section className="flex flex-col items-center gap-2 p-5 sm:p-5 overflow-y-auto overflow-x-scroll md:gap-5 w-full" style={{ maxHeight: isMobile ? "calc(60vh - 100px)" : "none" }}>
            <div className="w-full flex flex-col md:items-center justify-center md:justify-between md:flex-row gap-4 ">
                <div className="flex flex-col gap-2 ">
                    <label className="text-gray-600 dark:text-gray-400">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="h-12 p-4 rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300 "
                        value={formData.personalInfo.name}
                        onChange={handleChange}
                        required
                        pattern="[A-Za-z]{3,}"
                        title="Please enter a valid name."
                    />
                </div>

                <div className="w-full flex flex-col md:w-1/2 gap-2">
                    <label className="text-gray-600 dark:text-gray-400">Last name</label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        name= "lastName"
                        className="h-12 p-4 rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.personalInfo.lastName}
                        onChange={handleChange}
                        required
                        pattern="[A-Za-z]{3,}"
                        title="Please enter a valid last name."
                    />
                </div>



            </div>

            <div className=" w-full flex flex-col gap-4 md:flex-row md:gap-8">
                <div className="flex flex-col w-full md:w-1/2 gap-2">
                    <label className="text-gray-600 dark:text-gray-400">Phone Number</label>
                    <input
                        type="number"
                        placeholder="Phone Number"
                        name="phoneNumber"
                        className="h-12 p-4 rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.personalInfo.phoneNumber}
                        onChange={handleChange}
                        required
                        pattern="\d{10}" 
                        title="Please enter a valid phone number. (10 digits)"
                    />
                </div>

                <div className="flex flex-col w-full md:w-1/2 gap-2">
                    <label className="text-gray-600 dark:text-gray-400">Birthdate</label>
                    <input
                        type="date"
                        placeholder="Birthdate"
                        name="birthDate"
                        className="h-12 p-4 rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.personalInfo.birthDate}
                        onChange={handleChange}
                        required
                        min= "1900-01-01"
                        max= {new Date().toISOString().split("T")[0]}
                    />
                </div>

                <div className="flex flex-col w-full  md:w-1/2 gap-2">
                    <label className="text-gray-600 dark:text-gray-400">Gender</label>
                    <select className="h-12  rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                    value={formData.personalInfo.gender}
                    name="gender"
                    onChange={handleChange}
                    placeholder="Gender"
                    >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
        </section>

    )
}

export default StepPersonal;
