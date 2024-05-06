import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

import BookElement from "../discover/BookElement";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const ListBooks = () => {
    const { user, userLists } = useAuth();
    const location = useLocation();
    const path = location.pathname;
    let listName = path.split("/")[2];

    const [books, setBooks] = useState([]);
    const [booksId, setBooksId] = useState([]);
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);

    useEffect(() => {
        if (userLists) {
            setList(userLists[listName]);
        }
    }, [userLists, listName]);

    useEffect(() => {
        const fetchBooks = async () => {
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
                setBooks(booksData.filter(book => book !== null));
                setBooksId(list);
            } catch (error) {
                console.error('Error al obtener los libros:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        };

        fetchBooks();
    }, [list]);


    if (loading) {
        return <div>Cargando libros...</div>;
    }


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
            <h1 className="text-3xl font-bold text-center mt-10">{listName}</h1>

            <div className="content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-5 sm:px-10">
                {books.map((book, index) => (
                    <BookElement key={booksId[index]} bookInfo={book} bookId={booksId[index]} isList={true} />
                ))}
            </div>
        </main>
    );
};

export default ListBooks;
