import React, { useState, useEffect } from "react";
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

import BookElement from "./BookElement";

const Books = ({isAdmin}) => {
    const [books, setBooks] = useState(null);

    const getBooks = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "books"));
            const bookData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBooks(bookData);
        } catch (error) {
            console.error('Error al obtener los libros:', error);
        }
    };

    useEffect(() => {
        getBooks();
    }, []);
    

    return (
        <>
        
        <div className="content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-5 sm:px-10">
            {books && books.map(book => (
                <BookElement bookInfo={book} key={book.id} bookId={book.id} isAdmin={isAdmin} getBooks={getBooks} />    
            ))}
        </div>

        </>
    );
}

export default Books;
