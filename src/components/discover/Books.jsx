import React, { useState, useEffect } from "react";
import { db } from '../../services/firebase';
import { collection, getDocs, query, where, orderBy, onSnapshot } from 'firebase/firestore';

import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';

import ToggleButton from '@mui/material/ToggleButton';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import BookElement from "./BookElement";

import noDataImg from '../../assets/errors/no-books.png';

const Books = ({ isAdmin }) => {
    const [books, setBooks] = useState(null);
    const [genres, setGenres] = useState(null);
    const [genreFilter, setGenreFilter] = useState('');
    const [adminVerifiedBooks, setAdminVerifiedBooks] = useState(false);
    const [adminNonVerifiedBooks, setAdminNonVerifiedBooks] = useState(false);
    const [orderParam, setOrderParam] = useState('insertDate');
    const [order, setOrder] = useState('desc');
    const [booksPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    let verifiedColor = adminVerifiedBooks ? 'text-green-500' : 'text-gray-300';
    let adminVerifiedColor = adminVerifiedBooks ? 'text-green-500' : 'text-green-200';
    let nonVerifiedColor = adminNonVerifiedBooks ? 'text-red-500' : 'text-red-200';

    const getBooksFiltered = async (genre = '', page = 1) => {
        setCurrentPage(page);
        setGenreFilter(genre);

        let q;
        if (genre) {
            q = query(collection(db, "books"), where("genre", "==", genre));
        } else {
            q = query(collection(db, "books"), orderBy(orderParam, order));
        }

        onSnapshot(q, (querySnapshot) => {
            const bookData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            let filteredBooks = bookData;
            if (adminNonVerifiedBooks) {
                filteredBooks = bookData.filter(book => book.adminVerified !== true);
            }

            if (adminVerifiedBooks) {
                filteredBooks = bookData.filter(book => book.adminVerified === true);
            }

            const totalBooks = filteredBooks.length;
            const totalPages = Math.ceil(totalBooks / booksPerPage);
            setTotalPages(totalPages);

            const startIndex = (page - 1) * booksPerPage;
            const endIndex = startIndex + booksPerPage;
            const booksToShow = filteredBooks.slice(startIndex, endIndex);

            setBooks(booksToShow);
        });
    };

    const handleOrderChange = (e) => {
        const [param, order] = e.target.value.split('-');
        setOrderParam(param);
        setOrder(order);
    };

    const handlePageChange = (event, value) => {
        getBooksFiltered(genreFilter, value);
    };

    const getGenres = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "genres"));
            const genreData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setGenres(genreData);
        } catch (error) {
            console.error('Error al obtener los géneros:', error);
        }
    };

    useEffect(() => {
        getBooksFiltered();
        getGenres();
    }, []);

    useEffect(() => {
        getBooksFiltered(genreFilter);
    }, [adminVerifiedBooks, genreFilter, orderParam, order, adminNonVerifiedBooks]);

    return (
        <main className="md:content my-5 px-5 lg:px-10">
            <div className="flex justify-start sm:justify-between items-end gap-5 flex-wrap bg-gray-50 p-5 shadow rounded-xl">
                <div className="flex items-center gap-2">
                    <p className="">Filter by genre:  </p>
                    <form className="flex justify-start items-center ">
                        <select className="px-2 py-1 border border-gray-300 rounded-md" onChange={(e) => getBooksFiltered(e.target.value)}>
                            <option value="">All genres</option>
                            {genres && genres.map(genre => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>
                    </form>
                </div>
                {!genreFilter && <>
                    <div className="flex items-center gap-2">
                        <p className="">Order by:  </p>
                        <form className="flex justify-start items-center ">
                            <select className="px-2 py-1 border border-gray-300 rounded-md" onChange={handleOrderChange}>
                                <option value="insertDate-desc">Recents</option>
                                <option value="insertDate-asc">Oldest</option>
                                <option value="title-asc">Title</option>
                                <option value="author-asc">Author</option>
                            </select>
                        </form>
                    </div>
                </>}

                {isAdmin ?
                    <div className="flex items-center gap-2">
                        <p className="">Filter by:  </p>
                        <ToggleButton
                            value="check"
                            selected={adminVerifiedBooks}
                            onChange={() => {
                                setAdminVerifiedBooks(!adminVerifiedBooks);
                                if (adminNonVerifiedBooks) setAdminNonVerifiedBooks(false);
                            }
                            }
                        >
                            <VerifiedRoundedIcon className={`${adminVerifiedColor}`} fontSize="small" />
                        </ToggleButton>
                        <ToggleButton
                            value="check"
                            selected={adminNonVerifiedBooks}
                            onChange={() => {
                                setAdminNonVerifiedBooks(!adminNonVerifiedBooks);
                                if (adminVerifiedBooks) setAdminVerifiedBooks(false);
                            }}


                        >
                            <VerifiedRoundedIcon className={`${nonVerifiedColor}`} fontSize="small" />
                        </ToggleButton>
                    </div>
                    :
                    <button className="flex items-center px-3 py-2 bg-gray-100 w-fit text-gray-500 rounded-md text-sm" onClick={() => setAdminVerifiedBooks(!adminVerifiedBooks)}>
                        <VerifiedRoundedIcon className={`${verifiedColor} mr-2`} fontSize="small" />
                        {adminVerifiedBooks ? 'Verified books' : 'All books'}
                    </button>
                }

            </div>

            {books && books.length > 0 ?
                <>
                    <div className="content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
                        {books.map(book => (
                            <BookElement bookInfo={book} key={book.id} bookId={book.id} isAdmin={isAdmin} updateBooks={getBooksFiltered} />
                        ))}
                    </div>
                    <div className="flex justify-center items-center gap-5 mt-5">
                        <Stack spacing={2} className="flex justify-center mt-5">
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
                        </Stack>
                    </div>
                </> :

                <div className="content flex flex-col justify-center items-center gap-2 px-20 text-center" style={{ height: '60vh' }}>
                    <img src={noDataImg} alt="No data" className=" opacity-70 w-16" />
                    <div className="flex flex-col items-center ">
                        <h2 className="text-2xl text-gray-400">No books found</h2>
                        <p className="text-gray-300">We couldn't find books with these filters</p>
                        </div>
                </div>
            }
        </main>
    );
}

export default Books;
