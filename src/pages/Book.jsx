import React, { useEffect, useState } from 'react';

import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useLocation } from "react-router-dom";


const Book = () => {
    const [book, setBook] = useState(null);
    const location = useLocation();
    const path = location.pathname;
    const bookId = path.split("/")[2];

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const docRef = doc(db, "books", bookId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setBook(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error al obtener el libro:', error);
            }
        };

        fetchBook();
    }, [bookId]);



    return (
        <div>
            <Link to="/discover">Back</Link>
            <h1>Book</h1>
            {book &&
                <>
                    <h2>{book.title}</h2>
                    <p>{book.author}</p>
                    <p>{book.genre}</p>
                    <p>{book.year}</p>
                    <img src={book.cover} alt={book.title} />
                </>
            }
        </div>
    );
}

export default Book;