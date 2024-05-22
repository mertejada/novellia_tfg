import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

import BookElement from "../discover/BookElement";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DeleteIcon from '@mui/icons-material/Delete';

const ListBooks = () => {
    const { user, userLists } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const path = location.pathname;
    const listName = path.split("/")[2];
    //quitar el camelCase, poner espacio y mayúscula la primera letra de cada palabra
    const listNameTitle = listName.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });

    const [listBooks, setListBooks] = useState([]);
    const [listBooksId, setListBooksId] = useState([]);
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);

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


    return (

        <main className="content p-5">
            <div className="flex items-center mb-8">
                <Link to="/bookshelf" className="text-zinc-200">
                    <div className="flex items-center gap-2">
                        <ArrowBackIosIcon />
                        <h1 className="text-2xl font-semibold ml-4 text-zinc-200">Bookshelf</h1>
                    </div>
                </Link>

            </div>
            <div className="flex items-end justify-center mb-8 gap-1">
                <div className="flex flex-col items-center gap-2 p-4">
                    <h2 className="title">{listNameTitle}</h2>
                    <h3 className="text-gray-400">{listBooks.length} books</h3>

                </div>


                {!defaultLists.includes(listName) &&
                    <button onClick={deleteList} className="m-2 text-red-500 hover:scale-125 transform transition duration-300 ease-in-out">
                        <DeleteIcon fontSize="small" />
                    </button>
                }
            </div>



            <div className="content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-5 sm:px-10">
                {listBooks.map((book, index) => (
                    <BookElement key={listBooksId[index]} bookInfo={book} bookId={listBooksId[index]} isList={true} listName={listName} />
                ))}
            </div>


        </main>
    );
};

export default ListBooks;
