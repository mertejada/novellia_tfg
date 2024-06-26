import React, { useEffect, useState } from "react";
import { db } from '../../services/firebase';
import { collection, query, where, getDoc, doc, getDocs } from 'firebase/firestore';
import { Link } from "react-router-dom";

import CircularProgress from '@mui/material/CircularProgress';

/**
 * 
 * @param {*} userGenres
 * @returns Recommended Book component 
 */
const RecommendedBook = ({ userGenres }) => {
    const [loading, setLoading] = useState(true);

    const [recommendedBook, setRecommendedBook] = useState(null);
    const [recommendedBookGenre, setRecommendedBookGenre] = useState({});

    /**
     * Fetch a random book from the database
     * @returns {void}
     */
    const getRecommendedBook = async () => {
        if(!userGenres || userGenres.length === 0){
            setLoading(false);
            return;
        }

        try {
            const booksRef = collection(db, "books");
            const q = query(booksRef, where("genre", "in", userGenres), where("adminVerified", "==", true)); // Get books with user genres
            const querySnapshot = await getDocs(q);

            let books = [];
            querySnapshot.forEach((doc) => { // get every book from the query
                books.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // Get a random book from the list
            let randomBook = books[Math.floor(Math.random() * books.length)];
            setRecommendedBook(randomBook);

            // Get the genre of the book
            let genreRef = doc(db, "genres", randomBook.genre);
            const genreDoc = await getDoc(genreRef);
            setRecommendedBookGenre(genreDoc.data());

            setLoading(false);
        } catch (error) {
            console.error("Error getting recommended book:", error);
        }

    };

    // Fetch a random book on component mount or when userGenres change
    useEffect(() => {
        getRecommendedBook();
    }, [userGenres]);
    
    const renderRecommendedBook = () => (
        <article className="flex flex-col md:flex-row justify-evenly items-center content-element w-full h-fit p-4 space-y-4 md:space-y-0 md:space-x-4">

            <div className="text-start  flex flex-col items-center md:items-start gap-5 p-3 w-full md:w-1/2">
                <h1 className="text-center  md:text-start"><span className="title gradient text-gradient">You may like...</span></h1>

                <div className="flex flex-col gap-2 shadow rounded-xl border md:border-0 md:shadow-none md:rounded-none py-8 px-5 md:p-0 items-center md:items-baseline bg-white relative overflow-hidden">
                    <h2 className="font-bold text-lg sm:text-2xl text-center md:text-start w-2/3">{recommendedBook.title}</h2>
                    <p className="font-light text-mariner text-center md:text-start">{recommendedBook.author} - {recommendedBook.published}</p>
                    <p className="font-light text-white text-center md:text-start p-1 px-2 rounded-lg" style={{ backgroundColor: recommendedBookGenre.color }}>{recommendedBookGenre.name}</p>
                    <div className="relative h-28 overflow-hidden">
                        <p className="mt-2 font-light text-gray-500 overflow-hidden relative z-10 text-justify">
                            {recommendedBook.sipnosis}
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent z-20"></div>
                    </div>
                    <Link to={`/book/${recommendedBook.id}`} name="Read More" className="button text-white bg-gray-300 rounded-md text-center w-full md:w-fit hover:bg-carrot duration-200 ease-in-out">
                    Read more
                    </Link>
                </div>
                
            </div>
            <img src={recommendedBook.cover} alt={recommendedBook.title} className=" rounded-xl border" width={200} height={300} />
        </article>
    );

    return (
        <section className="content">
            {loading ?
                <div className="flex justify-center items-center w-full h-96">
                    <CircularProgress />
                </div>
                :
                (recommendedBook  &&
                    renderRecommendedBook()
                )
            }
        </section>
    );
};

export default RecommendedBook;
