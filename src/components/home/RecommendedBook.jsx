import React, { useEffect, useState } from "react";
import { db } from '../../services/firebase';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { Link } from "react-router-dom";

const RecommendedBook = ({ userGenres }) => {
    const [genresBooks, setGenresBooks] = useState([]); // Added state for latestBooks
    const [recommendedBook, setRecommendedBook] = useState(null);
    const [loading, setLoading] = useState(true);

    const chooseRandomGenre = (genres) => {
        return genres[Math.floor(Math.random() * genres.length)];
    }

    const fetchGenresBooks = () => {
        if (!userGenres || userGenres.length === 0) {
            setLoading(false);
            return;
        }
    
        try {
            const genre = chooseRandomGenre(userGenres);
            // Include condition for adminVerified to be true
            const q = query(collection(db, 'books'), where('genre', '==', genre), where('adminVerified', '==', true));
    
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const books = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
    
                setGenresBooks(books);
                setLoading(false); // Set loading to false once data is fetched
            }, (error) => {
                console.error('Failed to fetch genres books:', error);
                setLoading(false); // Set loading to false in case of an error
            });
    
            return unsubscribe; // Return the unsubscribe function to clean up the listener
        } catch (error) {
            console.error('Failed to set up snapshot listener:', error);
            setLoading(false); // Set loading to false in case of an error
        }
    };

    const chooseRandomRecommendedBook = () => {
        if (genresBooks.length > 0) {
            const randomBook = genresBooks[Math.floor(Math.random() * genresBooks.length)];
            setRecommendedBook(randomBook);
        }else{
            setRecommendedBook(null);
        }
        setLoading(false);
    }

    const renderRecommendedBook = () => {
        return (
            <div className="flex flex-col md:flex-row justify-evenly items-center content-element w-full h-fit p-4 space-y-4 md:space-y-0 md:space-x-4">
            <div className="text-start flex flex-col gap-10 p-3 w-full md:w-1/2">
                <h1 ><span className="title gradient text-gradient text-center md:text-start">You may like...</span></h1>
                <div className="flex flex-col gap-4 rounded-xl items-center md:items-baseline  bg-white relative overflow-hidden">
                    <h2 className="font-bold text-2xl text-center md:text-start">{recommendedBook.title}</h2>
                    <p className="font-light text-lavender text-center md:text-start">{recommendedBook.author}</p>
                    <div className="relative h-28 overflow-hidden">
                        <p className="font-light text-gray-500 overflow-hidden relative z-10">
                            {recommendedBook.sipnosis}
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent z-20"></div>
                    </div>
                    <Link to={`/book/${recommendedBook.id}`} className="button text-white bg-crayola py-2 rounded-md text-center mt-2 w-fit px-10">
                        Read more
                    </Link>
                </div>
            </div>
            <img src={recommendedBook.cover} alt={recommendedBook.title} className="w-52 rounded-xl border" />
        </div>
        );
    }


    useEffect(() => {
        fetchGenresBooks();
    }, [userGenres]);

    useEffect(() => {
        chooseRandomRecommendedBook();
    }, [genresBooks]);



    return (
        <div className="content ">
            {loading ? <p>Loading...</p> :
                recommendedBook && renderRecommendedBook() 
            }
        </div>
    );
}


export default RecommendedBook;