import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import CircularProgress from '@mui/material/CircularProgress';

import DailyReading from "./progress/DailyReading";
import DifferentGenres from "./progress/DifferentGenres";
import { get } from "firebase/database";



const Progress = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [finishedBooksInfo, setFinishedBooksInfo] = useState([]);
    const [finishedBooksGenres, setFinishedBooksGenres] = useState([]);

    const userDocRef = doc(db, 'users', user.uid);


    const getUserInfo = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const userDoc = docSnap.data();
            setUserInfo(userDoc);

            const finishedBooks = userDoc.lists.finishedBooks;
            const finishedBooksInfo = await getUserFinishedBooksInfo(finishedBooks);

            setFinishedBooksInfo(finishedBooksInfo);
            let genres = finishedBooksInfo.map((book) => {
                if (book) {
                    return book.genre;
                    
                }
            });


            genres = genres.filter((genre) => genre !== undefined);
            setFinishedBooksGenres(genres);
            
        }

        setLoading(false);

    }

    const getUserFinishedBooksInfo = async (finishedBooks) => {
        const promises = finishedBooks.map(async (bookId) => {

            const bookDocRef = doc(db, 'books', bookId);
            const bookDoc = await getDoc(bookDocRef);

            if (bookDoc.exists()) {
                const bookData = bookDoc.data();
                return bookData;
            }else{
                return null;
            }

        });

        const booksData = await Promise.all(promises);
        return booksData;
    }

    useEffect(() => {
        getUserInfo();
    }, []);






    return (
        <div>

            {loading ? <p>Loading...</p> :

                <div className="flex  items-center justify-center  gap-10 m-10 ">
                    <DailyReading userInfo={userInfo} title="Today's Reading"/>
                    <DifferentGenres userInfo={userInfo} genres={finishedBooksGenres} />
                    <DailyReading userInfo={userInfo} title="Read books this year" type="dailyReading" />
                </div>

            }
        </div>
    );
}

export default Progress;