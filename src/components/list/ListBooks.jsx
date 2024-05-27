import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

import { BeenhereRounded, BookRounded, FavoriteRounded, ShoppingBasketRounded, DashboardRounded, KeyboardArrowRightRounded } from '@mui/icons-material';


import BookElement from "../discover/BookElement";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DeleteIcon from '@mui/icons-material/Delete';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const ListBooks = () => {
    const { user, userLists } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const path = location.pathname;
    const listName = path.split("/")[2];
    const listNameTitle = listName.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });

    const [listBooks, setListBooks] = useState([]);
    const [listBooksId, setListBooksId] = useState([]);
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 8;

    const icons = {
        "favourites": <FavoriteRounded className="text-red-500" />,
        "wishList": <ShoppingBasketRounded className="text-lavender" />,
        "currentlyReading": <BookRounded className="text-crayola" />,
        "finishedBooks": <BeenhereRounded className="text-green-800" />,
    };

    useEffect(() => {
        if (userLists) {
            setList(userLists[listName]);
        }
    }, [userLists, listName]);

    useEffect(() => {
        const getListBooks = async () => {
            try {
                const promises = list.map(async (bookId) => {
                    const docRef = doc(db, "books", bookId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        return docSnap.data();
                    } else {
                        console.log('No such document!');
                        return null;
                    }
                });
                const booksData = await Promise.all(promises);

                setListBooks(booksData.filter(book => book !== null));
                setListBooksId(list);
            } catch (error) {
                console.error('Error al obtener los libros:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };

        getListBooks();
    }, [list]);

    const deleteList = async () => {
        try {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const updatedLists = { ...userData.lists };
                delete updatedLists[listName];

                await updateDoc(userRef, { lists: updatedLists });
            }

            navigate('/bookshelf');
        } catch (error) {
            console.error("Error deleting list:", error);
        }
    }

    const defaultLists = ['currentlyReading', 'wishList', 'favourites', 'finishedBooks'];

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = listBooks.slice(indexOfFirstBook, indexOfLastBook);

    return (
        <main className="content p-5">
            <div className="flex items-center justify-between mb-8">
                <Link to="/bookshelf" className="text-zinc-200">
                    <div className="flex items-center gap-2">
                        <ArrowBackIosIcon />
                        <h1 className="text-2xl font-semibold ml-4 text-zinc-200">Bookshelf</h1>
                    </div>
                </Link>

            {!defaultLists.includes(listName) &&
                    <button onClick={deleteList} className="m-2 text-red-500 hover:scale-105 transform transition duration-300 ease-in-out">
                        <DeleteIcon fontSize="small" /> Delete list
                    </button>
                }
            </div>
            <div className="flex items-end justify-center mb-8 gap-1">
                <div className="flex flex-col items-center gap-2 p-4 m-5">
                    <div className="flex items-center gap-2">
                        {icons[listName] || <DashboardRounded className="text-gray-500" />}
                        <h1 className="text-3xl font-semibold">{listNameTitle}</h1>
                    </div>
                    <h3 className="text-gray-400">{listBooks.length} books</h3>
                </div>
                
            </div>
            <div className="content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-5 sm:px-10">
                {
                    loading ?
                    <p className="text-gray-400 text-center">Loading...</p> :

                        currentBooks.map(book => (
                            <BookElement bookInfo={book} key={book.id} bookId={book.id} />
                        ))
                }
            </div>
            <Stack spacing={2} className="flex  items-center mt-8">
                <Pagination 
                    count={Math.ceil(listBooks.length / booksPerPage)} 
                    page={currentPage} 
                    onChange={handlePageChange} 
                    color="primary" 
                />
            </Stack>
        </main>
    );
};

export default ListBooks;
