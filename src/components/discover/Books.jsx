import React, { useState, useEffect } from "react";
import { db } from '../../services/firebase';
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import ToggleButton from '@mui/material/ToggleButton';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import BookElement from "./BookElement";

const Books = ({ isAdmin }) => {
    const [books, setBooks] = useState(null);
    const [genres, setGenres] = useState(null);
    const [genreFilter, setGenreFilter] = useState('');
    const [adminVerifiedBooks, setAdminVerifiedBooks] = useState(false);
    const [orderParam, setOrderParam] = useState('insertDate'); // ['asc', 'desc']
    const [order, setOrder] = useState('asc');
    const [booksLength, setBooksLength] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    let verifiedColor = adminVerifiedBooks ? 'text-green-500' : 'text-gray-300';

    const getBooksFiltered = async (genre = '') => {
        setGenreFilter(genre);
        try {
            let q;
            if (genre) {
                q = query(collection(db, "books"), where("genre", "==", genre));
            } else {
                q = query(collection(db, "books"), orderBy(orderParam, order));
            }
            const querySnapshot = await getDocs(q);
            const bookData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            let filteredBooks = bookData;
            if (adminVerifiedBooks) {
                filteredBooks = bookData.filter(book => book.adminVerified === true);
            }

            setBooks(filteredBooks);
            setBooksLength(filteredBooks.length);
        } catch (error) {
            console.error('Error al obtener los libros:', error);
        }
    };

    const handleOrderChange = (e) => {
        const [param, order] = e.target.value.split('-');
        setOrderParam(param);
        setOrder(order);
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
    }, [adminVerifiedBooks, genreFilter, orderParam, order]);

    return (
        <main className="content px-5 sm:px-10">
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
                                <option value="title-asc">Title</option>
                                <option value="author-asc">Author</option>
                            </select>
                        </form>
                    </div>
                </>}
                <button className="flex items-center px-3 py-2 bg-gray-100 w-fit text-gray-500 rounded-md" onClick={() => setAdminVerifiedBooks(!adminVerifiedBooks)}>
                    <VerifiedRoundedIcon className={`${verifiedColor} mr-1`} />
                    {adminVerifiedBooks ? 'Verified books' : 'All books'}
                </button>
            </div>

            {books && books.length > 0 ?
                <>
                    <div className="content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
                        {books.map(book => (
                            <BookElement bookInfo={book} key={book.id} bookId={book.id} isAdmin={isAdmin} />
                        ))}
                    </div>
                    <Stack spacing={2} className="flex justify-center mt-5">
                        <Pagination count={Math.ceil(booksLength / 8)} color="primary" />
                    </Stack>
                </> :
                <div className="flex justify-center items-center h-96">
                    <h2 className="text-2xl">No hay libros disponibles</h2>
                </div>
            }
        </main>
    );
}

export default Books;
