import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";


import CircularProgress from '@mui/material/CircularProgress';
import ProgressItem from "./ProgressItem";

import Modal from '@mui/material/Modal';

/**
 * 
 * @returns Progress component
 */
const Progress = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userGoals, setUserGoals] = useState([]);
    const [userReadingSessions, setUserReadingSessions] = useState([]);
    const [userFinishedBooks, setUserFinishedBooks] = useState(0);

    const [yearOptions, setYearOptions] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [thisYearFinishedBooks, setThisYearFinishedBooks] = useState(0);
    const [thisYearDiffGenres, setThisYearDiffGenres] = useState(0);
    const [thisYearDiffGenresNum, setThisYearDiffGenresNum] = useState(0);
    const [thisYearTotalHours, setThisYearTotalHours] = useState(0);

    const [todaysReading, setTodaysReading] = useState(0);

    /**
     * Get user information from database
     * @returns {void}
     */
    const getUserInfo = () => {
        const userDocRef = doc(db, 'users', user.uid);

        // Get user information in real-time updates
        onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const userDoc = docSnap.data();

                setUserGoals(userDoc.readingGoals);
                setUserReadingSessions(userDoc.readingSessions);
                setUserFinishedBooks(userDoc.finishedBooksInfo);
            }

            setLoading(false);
        });
    }

    /**
     * Get years from user reading sessions and finished books
     */
    const getYears = () => {
        let years = [];

        if (userFinishedBooks) {
            Object.values(userFinishedBooks).forEach(book => {
                const bookDate = new Date(book.finishedDate);
                years.push(bookDate.getFullYear());
            });
        }

        if (userReadingSessions) {
            userReadingSessions.forEach(session => {
                const sessionDate = new Date(session.date);
                if (!years.includes(sessionDate.getFullYear())) {
                    years.push(sessionDate.getFullYear());
                }
            }
            );
        }

        const uniqueYears = [...new Set(years)];
        setYearOptions(uniqueYears);
    }

    /**
     * Get today's reading time
     */
    const getTodaysReading = async () => {

        let todaysReading = 0;

        if (userReadingSessions) {
            userReadingSessions.filter(session => {
                const sessionDate = new Date(session.date);
                const todaysSessions = sessionDate.toDateString() === new Date().toDateString();

                if (todaysSessions) {
                    todaysReading += session.time;
                }
            });
        }

        setTodaysReading(Math.floor(todaysReading / 60));
    }

    /**
     * Get this year's total reading hours
     */
    const getThisYearTotalHours = () => {
        let totalHours = 0;

        if (userReadingSessions) {
            userReadingSessions.forEach(session => {
                const sessionDate = new Date(session.date);
                if (sessionDate.getFullYear() === selectedYear) {
                    totalHours += session.time;
                }
            }
            );
        }

        setThisYearTotalHours(Math.floor(totalHours / 3600));
    }

    /**
     * Get this year's finished books
     */
    const getThisYearFinishedBooks = () => {
        let finishedBooks = 0;

        Object.values(userFinishedBooks).forEach(book => {
            const bookDate = new Date(book.finishedDate);
            if (bookDate.getFullYear() === selectedYear) {
                finishedBooks++;
            }
        });

        setThisYearFinishedBooks(finishedBooks);
    };

    /**
     * Get this year's different genres
     * @returns {void}
     */
    const getThisYearDiffGenres = async () => {
        let genres = [];

        // From all the finished books, get the genres and filter by the selected year
        const promises = Object.values(userFinishedBooks).map(async (book) => {
            const bookDate = new Date(book.finishedDate);

            if (bookDate.getFullYear() === selectedYear) {
                const bookRef = doc(db, 'books', book.id);
                const bookDoc = await getDoc(bookRef);
                if (bookDoc.exists()) {
                    const bookData = bookDoc.data();
                    return bookData.genre;
                }
            }
            return null;
        });

        const results = await Promise.all(promises);

        // Filter out null values and get unique genres
        genres = results.filter(genre => genre !== null);
        const uniqueGenres = [...new Set(genres)];

        setThisYearDiffGenres(uniqueGenres);
        setThisYearDiffGenresNum(uniqueGenres.length);
    };

    /**
     * Handle year change
     * @param {*} e 
     */
    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    }

    // Get user information on component mount
    useEffect(() => {
        getUserInfo();
    }, []);

    // Get today's reading time on userReadingSessions change
    useEffect(() => {
        getTodaysReading();
    }, [userReadingSessions]);

    // Get this year's progress on selectedYear change and userReadingSessions change
    useEffect(() => {
        getThisYearFinishedBooks();
        getThisYearDiffGenres();
        getThisYearTotalHours();
    }, [userFinishedBooks, userReadingSessions, selectedYear]);

    // Get years on userReadingSessions and userFinishedBooks change
    useEffect(() => {
        getYears();
    }, [userReadingSessions, userFinishedBooks]);


    return (
        <section className="content content-element">
            {loading ?
                <div className="flex items-center justify-center">
                    <CircularProgress />
                </div>
                :
                <>

                    <article className="flex flex-col justify-between gap-5 my-5">
                            <h1 className="subtitle"><span className="text-gradient gradient">Today's</span>  progress</h1>
                            

                        <ProgressItem title="Today's reading" content='minutes' min={userGoals.dailyReading} value={todaysReading} reach={true} greyBg={true} isTodayProgress={true} />
                    </article>


                    <article className="content-element flex items-center justify-between gap-5 my-5">
                        <h1 className="subtitle flex items-center"><span className="text-gradient gradient">Your {selectedYear}</span> progress</h1>

                        <form className="flex flex-col items-center justify-center gap-5" onChange={handleYearChange}>
                            <select className="border rounded-lg p-2" name="year" id="year" value={selectedYear}>
                                {yearOptions.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </select>
                        </form>

                    </article>

                    <article className=" grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
                        <ProgressItem title="Finished books" content='books' min={userGoals.booksPerYear} value={thisYearFinishedBooks} reach={true} />
                        <ProgressItem title="Different genres" content='genres' min={userGoals.diffGenres} value={thisYearDiffGenresNum} reach={true} />
                        <ProgressItem title="Reading total hours" content='hours' min={userGoals.totalHours} value={thisYearTotalHours} />
                    </article>
                </>
            }
        </section>
    );
}

export default Progress;