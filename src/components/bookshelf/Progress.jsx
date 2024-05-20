import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import CircularProgress from '@mui/material/CircularProgress';

import ProgressItem from "./progress/ProgressItem";
import { get } from "firebase/database";



const Progress = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userGoals, setUserGoals] = useState([]);
    const [userReadingSessions, setUserReadingSessions] = useState([]);
    const [userFinishedBooks, setUserFinishedBooks] = useState(0);

    const [yearOptions, setYearOptions ] = useState([]);   
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [thisYearFinishedBooks, setThisYearFinishedBooks] = useState(0);
    const [thisYearDiffGenres, setThisYearDiffGenres] = useState(0);
    const [thisYearDiffGenresNum, setThisYearDiffGenresNum] = useState(0);

    const [todaysReading, setTodaysReading] = useState(0);


    const getUserInfo = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const userDoc = docSnap.data();
            setUserGoals(userDoc.readingGoals);
            setUserReadingSessions(userDoc.readingSessions);
            setUserFinishedBooks(userDoc.finishedBooksInfo); //devuelve un objeto
        }
        setLoading(false);
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
        console.log(uniqueYears)
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
                const bookRef = doc(db, 'books', book.id); // Asegúrate de que 'bookId' es la clave correcta
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

    }, [userReadingSessions]);

    useEffect(() => {
        getThisYearFinishedBooks();
        getThisYearDiffGenres();
    }
        , [userFinishedBooks, selectedYear]);

    useEffect(() => {
        getYears();
    }, [userReadingSessions, userFinishedBooks]);


    return (
        <div>

            <form className="flex flex-col items-center justify-center gap-5 m-10" onChange={handleYearChange}>
                <h1 className="text-3xl font-bold">Year</h1>
                <select className="border rounded-lg p-2" name="year" id="year" value={selectedYear}>
                    {yearOptions.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}
                </select>
            </form>

            {loading ? <p>Loading...</p> :

                <div className="flex flex-wrap  items-center justify-center border shadow rounded-xl  gap-10 m-10 ">
                    <ProgressItem userInfo={userGoals} title="Today's Reading" content='min' min={userGoals.dailyReading} value={todaysReading} />
                    <ProgressItem userInfo={userGoals} title={`${selectedYear}'s Finished Books`} content='books' min={userGoals.finishedBooks} value={thisYearFinishedBooks} />
                    <ProgressItem userInfo={userGoals} title={`${selectedYear}'s Different Genres`} content='genres' min={userGoals.diffGenres} value={thisYearDiffGenresNum} />
                </div>

            }
        </div>
    );
}

export default Progress;