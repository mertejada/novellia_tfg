import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import CircularProgress from '@mui/material/CircularProgress';
import ProgressItem from "./ProgressItem";



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
    
        // Usar onSnapshot para escuchar cambios en tiempo real
        onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const userDoc = docSnap.data();
    
                setUserGoals(userDoc.readingGoals);
                setUserReadingSessions(userDoc.readingSessions);
                setUserFinishedBooks(userDoc.finishedBooksInfo); //devuelve un objeto
            }
    
            setLoading(false);
        });
    }

    //conseguir los años en los que el usuario tiene registros de sesiones o libros terminados
    const getYears = () => {
        let years = [];

        if (userFinishedBooks) {
            Object.values(userFinishedBooks).forEach(book => {
                const bookDate = new Date(book.finishedDate);
                years.push(bookDate.getFullYear());
            });

        }

        const uniqueYears = [...new Set(years)];
        setYearOptions(uniqueYears);
    }


    const getTodaysReading = async () => {

        let todaysReading = 0;

        if (userReadingSessions) {
            userReadingSessions.filter(session => {
                const sessionDate = new Date(session.date);
                console.log(sessionDate.toDateString(), new Date().toDateString());
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

    useEffect(() => {
        getUserInfo();
    }, []);


    useEffect(() => {
        getTodaysReading();
    }
        , [userReadingSessions]);

    useEffect(() => {
        getThisYearFinishedBooks();
        getThisYearDiffGenres();
        getThisYearTotalHours();
    }
        , [userFinishedBooks, userReadingSessions, selectedYear]);

    useEffect(() => {
        getYears();
    }, [userReadingSessions, userFinishedBooks]);


    return (
        <div className="content content-element">
            {loading ? <p>Loading...</p> :
                <>

                    <div className="flex flex-col justify-between gap-5 my-5">
                        <h1 className="subtitle"><span className="text-gradient gradient">Today's</span>  progress</h1>
                        <ProgressItem userInfo={userGoals} title="Today's reading" content='minutes' min={userGoals.dailyReading} value={todaysReading} reach={true} greyBg={true} />

                    </div>


                    <div className="content-element flex items-center justify-between gap-5 my-5">
                        <h1 className="subtitle"><span className="text-gradient gradient">Your {selectedYear}</span>  progress</h1>
                        <form className="flex flex-col items-center justify-center gap-5" onChange={handleYearChange}>
                            <select className="border rounded-lg p-2" name="year" id="year" value={selectedYear}>
                                {yearOptions.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </select>
                        </form>

                    </div>



                    <div className=" grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
                        <ProgressItem userInfo={userGoals} title="Finished books" content='books' min={userGoals.booksPerYear} value={thisYearFinishedBooks} reach={true} />
                        <ProgressItem userInfo={userGoals} title="Different genres" content='genres' min={userGoals.diffGenres} value={thisYearDiffGenresNum} reach={true} />
                        <ProgressItem userInfo={userGoals} title="Reading total hours" content='hours' min={userGoals.totalHours} value={thisYearTotalHours} />
                    </div>
                </>
            }
        </div>
    );
}

export default Progress;