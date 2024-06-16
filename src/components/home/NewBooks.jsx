import React from "react";
import { db } from "../../services/firebase";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useMediaQueries } from "../../contexts/MediaQueries";

import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

/**
 * 
 * @returns New Books component
 */
const NewBooks = () => {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const { isMobile, isTablet, isDesktop } = useMediaQueries();

    /**
     * Fetch the latest books from the database
     * @returns {void}
     */
    const getNewBooks = async () => {
        const q = query(collection(db, "books"), orderBy("insertDate", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        const booksData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setBooks(booksData);
    }

    // Fetch new books on component mount
    useEffect(() => {
        getNewBooks();
    }, []);

    /**
     * Handle hover effect on book card
     * @param {*} e 
     */
    const handleHover = (e) => {
        const target = e.currentTarget;
        target.style.transform = "scale(1.1)";
        target.style.transition = "transform 0.5s ease";

        const button = target.children[1];
        button.style.transition = "background-color 0.5s ease";
        button.classList.remove("bg-gray-300");
        button.classList.add("bg-carrot");
    }

    /**
     * Handle leave effect on book card
     * @param {*} e 
     */
    const handleLeave = (e) => {
        const target = e.currentTarget;
        const button = target.children[1];
        button.classList.add("bg-gray-300");
        button.classList.remove("bg-carrot");
        target.style.transform = "scale(1)";
        target.style.transition = "transform 0.5s ease";
    }

    /**
     * Scroll to top of the page
     */
    const handleScrollTop = () => {
        window.scrollTo(0, 0);
    }

    /**
     * Handle next page
     */
    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, books.length - 1));
    }

    /**
     * Handle previous page
     */
    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
    }

    return (
        <>
            <div className="bg-white content-element py-5 flex flex-col justify-center items-center gap-5" >
                <h1 className="title font-bold font-playfair text-center gradient text-gradient">Latest books</h1>
                <h2 className="subtitle text-gray-300 text-center mx-5 font-light">Take a look at the latest books added to our collection!</h2>
                <Link to="/discover" name="Discover more" className="button border border-gray-400 text-gray-400 transition-all duration-500 ease-in-out hover:scale-110 hover:bg-black hover:text-white hover:border-black"
                    onClick={handleScrollTop}>Discover more</Link>
            </div>
            <div className="content flex justify-center gap-10">
                {(isDesktop || isTablet) &&
                    books && books.map((book, index) => (
                        <div key={book.id} className={`grid grid-rows-1 items-center gap-5  ${index === Math.floor(books.length / 2) ? 'text-lg' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                            <img src={book.cover} alt={book.title} className="rounded-xl shadow border h-80 w-auto" height={300} width={200} />
                            <Link to={`/book/${book.id}`} name="View Details" className="bg-gray-300 text-center button hover:bg-carrot transition-all duration-500 ease-in-out text-white p-2 rounded-lg" onClick={handleScrollTop}>View details</Link>
                        </div>
                    ))}

                {(isMobile) &&

                    books.slice(currentPage, currentPage + 1).map(book => (
                        <div key={book.id} className="flex flex-col items-center self-center gap-5">
                            <img src={book.cover} alt={book.title} className="rounded-xl h-62 w-52" />
                            <Link to={`/book/${book.id}`} name="View Details" className=" button bg-carrot  text-white p-2 rounded-lg" onClick={handleScrollTop}>View details</Link>
                        </div>
                    ))
                }



            </div>
            {(isMobile) &&
                <div className="flex justify-center gap-5">

                    {currentPage > 0 && <KeyboardArrowLeftRoundedIcon className="cursor-pointer text-5xl text-carrot" onClick={handlePrevPage} />}
                    {currentPage < books.length - 1 && <KeyboardArrowRightRoundedIcon className="cursor-pointer text-5xl text-carrot" onClick={handleNextPage} />}
                </div>
            }
        </>

    )
}

export default NewBooks;