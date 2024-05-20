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
    const [userReadingSessions , setUserReadingSessions] = useState([]);
    const [userFinishedBooks, setUserFinishedBooks] = useState(0);


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

            /*el objeto userDoc.finishedBooksInfo tiene la siguiente estructura:
            finishedBooksInfo {
                bookId: {
                    finishedDate: date,
                    genre: genre,
                    pages: pages

                }
            }
            */
            
            


        }
        setLoading(false);
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
            if (bookDate.getFullYear() === new Date().getFullYear()) {
                finishedBooks++;
            }
        });

        setThisYearFinishedBooks(finishedBooks);
    };

    const getThisYearDiffGenres = async () => {
        let genres = [];
        const currentYear = new Date().getFullYear();
        
        const promises = Object.values(userFinishedBooks).map(async (book) => {
            const bookDate = new Date(book.finishedDate);

            if (bookDate.getFullYear() === currentYear) {
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
    , [userFinishedBooks]);


    return (
        <div>

            {loading ? <p>Loading...</p> :

                <div className="flex  items-center justify-center  gap-10 m-10 ">
                    <ProgressItem userInfo={userGoals} title="Today's Reading" content='min'  min={userGoals.dailyReading} value={todaysReading} />
                    <ProgressItem userInfo={userGoals} title="This Year's Finished Books" content='books' min={userGoals.booksPerYear} value={thisYearFinishedBooks} />
                    <ProgressItem userInfo={userGoals} title="This Year's Different Genres" content='genres' min={userGoals.diffGenres} value={thisYearDiffGenresNum} />
                </div>

            }
        </div>
    );
}

export default Progress;