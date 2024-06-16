import React, { useState } from "react";
import { useEffect } from "react";
import { useMediaQueries } from '../../contexts/MediaQueries';


import { useAuth } from '../../contexts/AuthContext';

import StepPersonal from "./StepPersonal";
import StepGoals from "./StepGoals";
import StepsInterests from "./StepsInterests";

import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InterestsIcon from '@mui/icons-material/Interests';
import BookIcon from '@mui/icons-material/Book';
import ErrorIcon from '@mui/icons-material/Error';


/**
 * 
 * @param {*} handleClose
 * @returns User Register form
 */
const UserRegister = ({ handleClose }) => {

    const { user } = useAuth();

    const [step, setStep] = useState(0);
    const [showFormError, setFormErrorMsg] = useState(null);
    const { isMobile } = useMediaQueries();

    useEffect(() => {
        document.body.style.overflowY = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        }
    }, []);

    // Form data
    const [formData, setFormData] = useState({
        personalInfo: {
            name: "",
            lastName: "",
            phoneNumber: "",
            birthDate: "",
            gender: "female"
        },
        readingGoals: {
            dailyReading: 30,
            booksPerYear: 10,
            diffGenres: 3
        },
        genres: [],
        userInfo: true 
    });

    /**
     * Validate step data and move to next step
     * @returns 
     */
    const nextStep = () => {
        if (step === 0 && !validatePersonalInput()) {
            return;
        }

        if (step === 1 && !validateGoalsInput()) {
            return;
        }
        setStep(step + 1);
    }

    /**
     * Validate personal input
     */
    const validatePersonalInput = () => {
        const { name, lastName, phoneNumber, birthDate } = formData.personalInfo;
        const currentDate = new Date();

        if (name === "" || lastName === "" || phoneNumber === "" || birthDate === "") {
            setFormErrorMsg("You must fill all the fields to continue");
            return false;
        }

        if (phoneNumber.length !== 9 || isNaN(phoneNumber)) {
            setFormErrorMsg("Enter a valid phone number before continuing");
            return false;
        }

        if (new Date(birthDate) > currentDate || new Date(birthDate) < new Date("1900-01-01")) {
            setFormErrorMsg("Enter a valid birthdate before continuing");
            return false;
        }

        if (name.length < 3 || lastName.length < 3) {
            setFormErrorMsg("Name and last name must be at least 3 characters long");
            return false;
        }

        if (!/^[a-zA-ZÀ-ÿ\s-]*$/.test(name) || !/^[a-zA-ZÀ-ÿ\s-]*$/.test(lastName)) {
            setFormErrorMsg("Name and last name must only contain letters, spaces, hyphens and accents");
            return false;
        }

        if(formData.personalInfo.gender === ""){
            setFormErrorMsg("You must choose a gender to continue");
            return false;
        }

        setFormErrorMsg(null);
        return true;
    }

    /**
     * Validate goals input
     */
    const validateGoalsInput = () => {
        const { dailyReading, booksPerYear, diffGenres } = formData.readingGoals;

        if (dailyReading < 1 || booksPerYear < 1 || diffGenres < 1) {
            setFormErrorMsg("You must enter a valid number for each field");
            return false;
        }

        setFormErrorMsg(null);
        return true;
    }

    /**
     * Handle previous step
     */
    const previousStep = () => {
        setStep(step - 1);
    }

    /**
     * Upload user data to database
     * @returns {void}
     */
    const uploadUserData = async () => {
        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, formData);
            handleClose();
        } catch (error) {
            console.error("Error updating data: ", error);
        }
    }

    /**
     * Render form based on step
     * @returns
     * */
    const renderForm = () => {
        switch (step) {
            case 0:
                return <StepPersonal formData={formData} setFormData={setFormData} />;
            case 1:
                return <StepGoals formData={formData} setFormData={setFormData} />;
            case 2:
                return <StepsInterests formData={formData} setFormData={setFormData} />;
            default:
                return null;
        }
    }

    return (
        <section id="register-form" className="form fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <article className="form-container bg-white m-5 rounded-2xl shadow-lg  p-4 md:p-8 h-fit" style={{ width: isMobile ? "90%" : "70%" }}>
                <div className="flex flex-col">
                    <h1 className="  mb-10 mt-5 self-center text-xl text-center md:text-left md:text-2xl">Welcome to <span className="text-2xl md:text-4xl gradient text-gradient font-extrabold font-playfair">Novellia!</span></h1>
                    <ol className="pb-6 mx-4 flex items-center text-sm font-medium text-center text-gray-300 dark:text-gray-400 sm:text-base flex-wrap sm:flex-nowrap">
                        <li className={`flex md:w-full items-center ${step >= 0 ? 'text-carrot dark:text-blue-500' : 'text-gray-300 dark:text-gray-400'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
                            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                                <AccountCircleIcon className="p-1" />
                                Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                            </span>
                        </li>
                        <li className={`flex md:w-full items-center ${step >= 1 ? 'text-carrot dark:text-blue-500' : 'text-gray-300 dark:text-gray-400'} after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
                            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                                <BookIcon className="p-1" />
                                Reading <span className="hidden sm:inline-flex sm:ms-2">goals</span>
                            </span>
                        </li>
                        <li className={`flex items-center ${step >= 2 ? 'text-carrot dark:text-blue-500' : 'text-gray-300 dark:text-gray-400'}`}>
                            <InterestsIcon className="p-1" />
                            Interests
                        </li>
                    </ol>
                </div>

                {renderForm()}
                {showFormError &&
                    <div className="flex items-center justify-center gap-2 text-red-500 m-1 mt-4">
                        <ErrorIcon />
                        <p>{showFormError}</p></div>}
                <div className="flex justify-between h-50">
                    <button onClick={handleClose} className="p-2 text-gray-300 mt-4">
                        <p className="flex items-center gap-2 ">
                            <CancelRoundedIcon />
                            {isMobile ?
                                "Exit" : "Continue later"
                            }
                        </p>

                    </button>
                    <div className="flex items-end gap-2 font-light ">
                        {step > 0 && <button onClick={previousStep} className=" bg-gray-300 button-register">Previous</button>}
                        {step < 2 ? <button onClick={nextStep} className=" bg-carrot button-register" >Continue</button> : <button className=" bg-carrot button button-register" onClick={uploadUserData}>Finish</button>}
                    </div>
                </div>
            </article>

        </section>
    )
}

export default UserRegister;
