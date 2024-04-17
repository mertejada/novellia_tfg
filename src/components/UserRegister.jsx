import React, { useState } from "react";
import appFirebase from '../services/firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { useEffect } from "react";
import StepPersonal from "./StepPersonal";
import StepGoals from "./StepGoals";
import StepsInterests from "./StepsInterests";

import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InterestsIcon from '@mui/icons-material/Interests';
import BookIcon from '@mui/icons-material/Book';

const UserRegister = () => {
    const auth = getAuth(appFirebase);
    const user = auth.currentUser;
    const db = getFirestore(appFirebase);

    const [step, setStep] = useState(0);

    const [formData, setFormData] = useState({
        personalInfo: {
            name: "wefwe",
            lastName: "",
            birthDate: "",
            phoneNumber: "",
            gender: "feminine"
        },
        readingGoals: {
            dailyReading: 30,
            booksPerYear: 10,
            diffGenres: 4
        },
        genres: [],
    });

    useEffect(() => {
        setFormData({
            personalInfo: {
                name: "",
                lastName: "",
                birthDate: "",
                phoneNumber: "",
                gender: ""
            },
            readingGoals: {
                dailyReading: 30,
                booksPerYear: 10,
                diffGenres: 4
            },
            genres: [],
            userInfo: true
        });
    }, [user]);

    const nextStep = () => {
        setStep(step + 1);
    }

    const previousStep = () => {
        setStep(step - 1);
    }

    const continueLater = () => {
        document.getElementById('register-form').style.display = 'none';
    }

    const handleSubmit = async () => {
        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, formData);
            // Close the form
            document.getElementById('register-form').style.display = 'none';
        } catch (error) {
            console.error("Error updating data: ", error);
        }
    }

    const renderForm = () => {
        switch (step) {
            case 0:
                return <StepPersonal formData={formData} setFormData={setFormData} />;
            case 1:
                return <StepGoals formData={formData} setFormData={setFormData}  />;
            case 2:
                return <StepsInterests formData={formData} setFormData={setFormData} />;
            default:
                return null;
        }
    }

    return (
        <div id="register-form" className="form fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="form-container bg-white rounded-2xl shadow-lg p-8 w-min lg:w-2/3">
                <h1 className="  mb-10 mt-5 text-3xl">Welcome to <span className="text-4xl gradient text-gradient font-extrabold font-playfair">Novellia!</span></h1>
                <ol className="pb-6 flex items-center text-sm font-medium text-center text-gray-300 dark:text-gray-400 sm:text-base flex-wrap sm:flex-nowrap">
                    <li className={`flex md:w-full items-center ${step >= 0 ? 'text-crayola dark:text-blue-500' : 'text-gray-300 dark:text-gray-400'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
                        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                            <AccountCircleIcon className="p-1" />
                            Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                        </span>
                    </li>
                    <li className={`flex md:w-full items-center ${step >= 1 ? 'text-crayola dark:text-blue-500' : 'text-gray-300 dark:text-gray-400'} after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
                        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                            <BookIcon className="p-1" />
                            Reading <span className="hidden sm:inline-flex sm:ms-2">goals</span>
                        </span>
                    </li>
                    <li className={`flex items-center ${step >= 2 ? 'text-crayola dark:text-blue-500' : 'text-gray-300 dark:text-gray-400'}`}>
                        <InterestsIcon className="p-1" />
                        Interests
                    </li>
                </ol>
                {renderForm()}
                <div className="flex justify-between">
                    <button onClick={continueLater} className="p-2 text-gray-300 mt-4">
                        <p className="flex items-center gap-2">
                            <CancelIcon />
                            Continue later
                        </p>

                    </button>
                    <div className="flex gap-2 font-light">
                        {step > 0 && <button onClick={previousStep} className="p-2 bg-gray-300 button mt-4">Previous</button>}
                        {step < 2 ? <button onClick={nextStep} className="p-2 bg-crayola button mt-4" >Continue</button> : <button className="p-2 bg-crayola button mt-4" onClick={handleSubmit}>Finish</button>}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserRegister;
