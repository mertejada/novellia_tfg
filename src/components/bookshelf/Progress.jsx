import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";


import CircularProgress from '@mui/material/CircularProgress';
import ProgressItem from "./ProgressItem";

import Modal from '@mui/material/Modal';


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


    const getUserInfo = () => {
        const userDocRef = doc(db, 'users', user.uid);

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

    const getThisYearDiffGenres = async () => {
        let genres = [];

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

        genres = results.filter(genre => genre !== null);
        const uniqueGenres = [...new Set(genres)];

        setThisYearDiffGenres(uniqueGenres);
        setThisYearDiffGenresNum(uniqueGenres.length);
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    }

    const showCongratulationsModal = () => {
        return (
            <Modal
                open={true}
                onClose={() => { }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="bg-white p-5 rounded-lg w-96 mx-auto mt-20">
                    <h1 className="text-center text-2xl font-bold">Congratulations!</h1>
                    <p className="text-center text-lg">You've reached your daily reading goal!</p>
                </div>
            </Modal>
        );
    }



    useEffect(() => {
        getUserInfo();
    }, []);


    useEffect(() => {
        getTodaysReading();
    }, [userReadingSessions]);

    useEffect(() => {
        getThisYearFinishedBooks();
        getThisYearDiffGenres();
        getThisYearTotalHours();
    }, [userFinishedBooks, userReadingSessions, selectedYear]);

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