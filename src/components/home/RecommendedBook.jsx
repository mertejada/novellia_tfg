import React, { useEffect, useState } from "react";
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { Link } from "react-router-dom";

const RecommendedBook = ({ userGenres }) => {
    const [genresBooks, setGenresBooks] = useState([]); // Added state for latestBooks
    const [recommendedBook, setRecommendedBook] = useState(null);
    const [recommendedBookGenre, setRecommendedBookGenre] = useState(null);
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
            getGenreInfo(randomBook.genre);

        }else{
            setRecommendedBook(null);
        }
        setLoading(false);
    }

    const getGenreInfo = async (genre) => {
        const genreDoc = await getDoc(doc(db, 'genres', genre));
        if (genreDoc.exists()) {
            setRecommendedBookGenre(genreDoc.data());
        } else {
            console.error('No genre found');
        }
    }



    const renderRecommendedBook = () => {
        return (
            <div className="flex flex-col md:flex-row justify-evenly items-center content-element w-full h-fit p-4 space-y-4 md:space-y-0 md:space-x-4">
            <div className="text-start flex flex-col gap-10 p-3 w-full md:w-1/2">
                <h1 className="text-center md:text-start" ><span className="title gradient text-gradient   ">You may like...</span></h1>
                <div className=" flex flex-col gap-2 rounded-xl items-center md:items-baseline  bg-white relative overflow-hidden">
                    <h2 className="font-bold text-lg sm:text-2xl text-center md:text-start w-2/3">{recommendedBook.title}</h2>
                    <p className="font-light text-lavender text-center md:text-start">{recommendedBook.author} - {recommendedBook.published}</p>
                    <p className="font-light text-white text-center md:text-start p-1 px-2 rounded-lg" style={{ backgroundColor: recommendedBookGenre.color}}>{recommendedBookGenre.name}</p>
                    <div className="relative h-28 overflow-hidden">
                        <p className="mt-2 font-light text-gray-500 overflow-hidden relative z-10 text-justify">
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

                recommendedBook && recommendedBookGenre ? renderRecommendedBook() : <p>No recommended book found</p>
            }
        </div>
    );
}


export default RecommendedBook;