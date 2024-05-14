import React from "react";
import { db } from "../../services/firebase";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useMediaQueries } from "../../contexts/MediaQueries";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';



const NewBooks = () => {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const { isMobile, isTablet, isDesktop } = useMediaQueries();

    const fetchBooks = async () => {
        //los 3 primeros libros cuya fecha de adición sea la más reciente
        const q = query(collection(db, "books"), orderBy("insertDate", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        const booksData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setBooks(booksData);
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleHover = (e) => {
        const target = e.currentTarget; // Accede al elemento al que se aplicó el evento
        target.style.transform = "scale(1.1)";
        target.style.transition = "transform 0.5s ease";

        const button = target.children[1];
        button.style.transition = "background-color 0.5s ease";
        button.classList.remove("bg-gray-300");
        button.classList.add("bg-crayola");
    }

    const handleLeave = (e) => {
        const target = e.currentTarget; // Accede al elemento al que se aplicó el evento
        const button = target.children[1];
        button.classList.add("bg-gray-300");
        button.classList.remove("bg-crayola");
        target.style.transform = "scale(1)";
        target.style.transition = "transform 0.5s ease";
    }

    const handleScrollTop = () => {
        window.scrollTo(0, 0);
    }

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, books.length - 1));
    }

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
    }

    return (
        <>
            <div className="bg-white content-element py-5 flex flex-col justify-center items-center gap-5" >
                <h1 className="title font-bold font-playfair text-center gradient text-gradient">Latest books</h1>
                <h2 className="subtitle text-gray-300 text-center mx-5 font-light">Take a look at the latest books added to our collection!</h2>
                <Link to="/discover" className="button border border-gray-400 text-gray-400 transition-all duration-500 ease-in-out hover:scale-110 hover:bg-black hover:text-white hover:border-black"
                onClick={handleScrollTop}>Discover more</Link>
                
            </div>
            <div className="content flex justify-center gap-10">
                {(isDesktop || isTablet) &&
                    books && books.map((book, index) => (
                        <div key={book.id} className={`grid grid-rows-1 items-center gap-5 ${index === Math.floor(books.length / 2) ? 'text-lg' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                            <img src={book.cover} alt={book.title} className="rounded-xl h-80 w-auto" />
                            <Link to={`/book/${book.id}`} className="bg-gray-300 text-center button hover:bg-crayola transition-all duration-500 ease-in-out text-white p-2 rounded-lg" onClick={handleScrollTop}>View details</Link>
                        </div>
                    ))}

                {(isMobile) &&

                    books.slice(currentPage, currentPage + 1).map(book => (
                        <div key={book.id} className="flex flex-col items-center self-center gap-5">
                            <img src={book.cover} alt={book.title} className="rounded-xl h-80 w-auto" />
                            <Link to={`/book/${book.id}`} className=" button bg-crayola  text-white p-2 rounded-lg" onClick={handleScrollTop}>View details</Link>
                        </div>
                    ))
                }



            </div>
            {(isMobile ) &&
                <div className="flex justify-center gap-5">

                    {currentPage > 0 && <ArrowBackIcon className="cursor-pointer text-5xl text-crayola" onClick={handlePrevPage} />}
                    {currentPage < books.length - 1 && <ArrowForwardIcon className="cursor-pointer text-5xl text-crayola" onClick={handleNextPage} />}
                </div>
            }
        </>

    )
}

export default NewBooks;