import React, { useState, useEffect } from "react";
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

import BookElement from "./BookElement";

const Books = () => {
    const [books, setBooks] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Realizar la consulta a la colección "books"
                const querySnapshot = await getDocs(collection(db, "books"));
                // Mapear los documentos obtenidos y extraer los datos de cada libro
                const bookData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBooks(bookData);
            } catch (error) {
                console.error('Error al obtener los libros:', error);
                // Manejar el error, por ejemplo, mostrar un mensaje de error al usuario
            }
        };

        // Llamar a la función fetchBooks cuando el componente se monte
        fetchBooks();
    }, []);

    return (
        <>
        
        <div className="content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-10">
            {books && books.map(book => (
                <BookElement bookInfo={book} />
            ))}
        </div>
        </>
    );
}

export default Books;
