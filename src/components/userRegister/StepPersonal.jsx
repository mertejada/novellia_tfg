import { update } from "firebase/database";
import React from "react";
import { useMediaQueries } from '../../contexts/MediaQueries';


const StepPersonal = ({ formData, setFormData }) => {
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

    const { isMobile } = useMediaQueries();
 
    return (
        <div className=" grid gap-10 p-5 sm:p-5 overflow-y-auto overflow-x-scroll h-fit md:px-10" style={{ maxHeight: isMobile ? "calc(60vh - 200px)" : "none"}}>
            <div className="flex flex-col md:flex-row md:gap-10">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-600 dark:text-gray-400">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="h-12 p-4 rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                        value={formData.personalInfo.name}
                        onChange={handleChange}
                        required
                        pattern="[A-Za-z]{3,}"
                        title="Please enter a valid name."
                    />
                </div>

                <div className="flex flex-col w-full md:w-1/2 gap-2">
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

            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
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
                    />
                </div>

                <div className="flex flex-col w-full  md:w-1/2 gap-2">
                    <label className="text-gray-600 dark:text-gray-400">Gender</label>
                    <select className="h-12  rounded-3xl border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300"
                    value={formData.personalInfo.gender}
                    name="gender"
                    onChange={handleChange}
                    >
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
