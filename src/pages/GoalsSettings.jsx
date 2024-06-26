import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

import InterestsIcon from '@mui/icons-material/Interests';
import BookIcon from '@mui/icons-material/Book';
import TimerIcon from '@mui/icons-material/Timer';

import Alert from "@mui/material/Alert";

/**
 * 
 * @returns Goals Settings page
 */
const GoalsSettings = () => {
    const { user } = useAuth();

    const [userGoals, setUserGoals] = useState({});

    const [updatedGoals, setUpdatedGoals] = useState({
        dailyReading: 0,
        booksPerYear: 0,
        diffGenres: ""
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", content: "" });

    // Fetch user goals
    useEffect(() => {
        /**
         * Get user goals
         * @returns {void}
         */
        const getUserGoals = async () => {
            const userDocRef = doc(db, 'users', user.uid);
            onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    const goals = doc.data().readingGoals;
                    setUserGoals(goals);
                    setUpdatedGoals(goals);
                    setLoading(false);
                }
            });
        };

        getUserGoals();
    }, [user]);

    // Handle input change in form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedGoals((prevGoals) => ({
            ...prevGoals,
            [name]: value,
        }));
    };

    /**
     * Validate goals input
     * @returns {boolean}
     */
    const validateGoals = () => {
        if (updatedGoals.dailyReading < 1 || updatedGoals.booksPerYear < 1 || updatedGoals.diffGenres < 1) {
            setMessage({ type: "error", content: "Please enter valid goals. Goals must be greater than 0." });
            return false;
        }

        return true;
    };


    /**
     * Update goals
     * @param {*} e 
     * @returns {void}
     */
    const updateGoals = async (e) => {
        e.preventDefault();
        if (!validateGoals()) { // Validate goals
            return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { readingGoals: updatedGoals }); // Update user goals
        setMessage({ type: "success", content: "Goals updated successfully!" });

        setTimeout(() => {
            setMessage({ type: "", content: "" });
        }, 2000);
    };

    return (
        <main className="content flex flex-col items-center py-10">
            <div className=" text-center">
                <h1 className="title text-gradient gradient mb-2  h-full">Goals Settings</h1>
                <h2 className="subtitle text-gray-300">Change your reading goals here!</h2>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={updateGoals} className="grid grid-cols-1 gap-7 md:grid-cols-2 w-full mt-20">
                    <section className="border shadow rounded-xl p-10 bg-white flex flex-col justify-between">
                        <div className="text-center mb-4 p-2 ">
                            <TimerIcon className="text-carrot my-2" />
                            <h2 className="text-2xl font-semibold  text-gray-800">Daily Reading</h2>
                            <p className="text-gray-300">Set a daily reading goal in minutes</p>
                        </div>
                        <div className="p-2">
                            <p className="text-mariner mb-2">Current goal: {userGoals.dailyReading} minutes</p>
                            <input
                                type="number"
                                name="dailyReading"
                                className="w-full h-12 p-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={updatedGoals.dailyReading}
                                onChange={handleInputChange}
                            />
                        </div>
                    </section>

                    <section className="border shadow rounded-xl p-10 bg-white flex flex-col justify-between">
                        <div className="text-center mb-4 p-2">
                            <BookIcon className="text-mariner my-2" />
                            <h2 className="text-2xl font-semibold  text-gray-800">Books Per Year</h2>
                            <p className="text-gray-300">Set a goal for the number of books you want to read in a year</p>
                        </div>
                        <div className="p-2">
                            <p className="text-mariner mb-2">Current goal is: {userGoals.booksPerYear} books</p>
                            <input
                                type="number"
                                name="booksPerYear"
                                className="w-full h-12 p-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={updatedGoals.booksPerYear}
                                onChange={handleInputChange}
                            />
                        </div>
                    </section>

                    <section className="border shadow rounded-xl p-8 bg-white md:col-span-2  flex flex-col justify-between">
                        <div className="text-center mb-4 p-2">
                            <InterestsIcon className="text-salmon my-2" />
                            <h2 className="text-2xl font-semibold  text-gray-800">Different Genres</h2>
                        </div>
                        <div>
                            <p className="text-mariner mb-2">Current goal is: {userGoals.diffGenres}</p>
                            <input
                                type="text"
                                name="diffGenres"
                                className="w-full h-12 p-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={updatedGoals.diffGenres}
                                placeholder="Enter genres separated by commas"
                                onChange={handleInputChange}
                            />
                        </div>
                    </section>

                    {message.content && (
                        <div className="md:col-span-2">
                            <Alert severity={message.type}>
                                {message.content}
                            </Alert>
                        </div>
                    )}

                    <div className="md:col-span-2 flex justify-center">
                        <button type="submit" className="m-3 button bg-carrot text-white" onClick={updateGoals}>
                            Update Goals
                        </button>
                    </div>
                </form>
            )}
        </main>
    );
};

export default GoalsSettings;
