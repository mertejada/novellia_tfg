import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { db, storage } from "../../services/firebase";
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { languages } from "../../data";

import Alert from '@mui/material/Alert';


const AddBook = ({ toggleAddBook }) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState({ type: null, content: null });

    const [genres, setGenres] = useState([]);    
    const [bookInfo, setBookInfo] = useState({
        title: '',
        author: '',
        sipnosis: '',
        pages: '',
        published: '',
        isbn: '',
        genre: '',
        publisher: '',
        rating: '',
        insertDate: new Date().toISOString(),

    });


    useEffect(() => {
        const fetchGenres = async () => {
            const querySnapshot = await getDocs(collection(db, "genres"));
            const genreNames = querySnapshot.docs.map(doc => doc.id);
            setGenres(genreNames);
        };

        fetchGenres();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookInfo(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const imageInputElement = document.getElementById("cover");
        const imageFile = imageInputElement.files[0];

        if (!bookInfo.title || !bookInfo.author || !bookInfo.sipnosis || !bookInfo.pages || !bookInfo.published || !bookInfo.isbn || !bookInfo.genre || !bookInfo.publisher ) {
            setMessage({ type: "error", content: "All fields are required" });
            return;
        }

        //si author o title no es un string
        if (typeof bookInfo.author !== "string" || typeof bookInfo.title !== "string") {
            setMessage({ type: "error", content: "Author and title must be strings" });
            return;
        }

        //si el isbn no es un numero con 10 digitos
        if (isNaN(parseInt(bookInfo.isbn)) || bookInfo.isbn.length !== 10) {
            setMessage({ type: "error", content: "ISBN must be a number with 10 digits" });
            return;
        }

        //el autor el publisher y el genero deben tener al menos 3 caracteres
        if (bookInfo.author.length < 3 || bookInfo.publisher.length < 3 || bookInfo.genre.length < 3) {
            setMessage({ type: "error", content: "Author, publisher and genre must be at least 3 characters long" });
            return;

        }

        //la sipnosis debe tener al menos 50 caracteres
        if (bookInfo.sipnosis.length < 50) {
            setMessage({ type: "error", content: "Sipnosis must be at least 50 characters long" });
            return;
        }

        //el publisher y el author deben contener solo letras
        if (!/^[a-zA-Z]*$/.test(bookInfo.author) || !/^[a-zA-Z]*$/.test(bookInfo.publisher)) {
            setMessage({ type: "error", content: "Author and publisher must contain only letters" });
            return;
        }



        setMessage({ type: "none", content: null });


        try {

            if (!imageFile.type.includes("image/")) {
                setMessage({ type: "error", content: "File must be an image" });
                return;
            }

            if (imageFile.size > 1000000) {
                setMessage({ type: "error", content: "File must be smaller than 1MB" });
                return;
            }



            let coverUrl = null;

            const storageRef = ref(storage, `covers/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            coverUrl = await getDownloadURL(storageRef);

            bookInfo.cover = coverUrl;


            await addDoc(collection(db, "books"), bookInfo);

            setMessage({ type: "success", content: "Book added successfully" });

        } catch (err) {
            console.error('Error adding book:', err);
            setMessage({ type: "error", content: "Failed to add book. Please try again later." });
        }


    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl w-2/3">
                <h2 className="text-2xl font-semibold mb-5">Add a new book</h2>
                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <input type="text" placeholder="Title" name="title" className="border border-gray-300 p-2 rounded-lg" value={bookInfo.title} onChange={handleChange} />
                        <input type="text" placeholder="Author" name="author" className="border border-gray-300 p-2 rounded-lg" value={bookInfo.author} onChange={handleChange} />
                        <textarea placeholder="Sipnosis" name="sipnosis" className="border border-gray-300 p-2 rounded-lg" value={bookInfo.sipnosis} onChange={handleChange}></textarea>
                        <input type="text" placeholder="Pages" name="pages" className="border border-gray-300 p-2 rounded-lg" value={bookInfo.pages} onChange={handleChange} />
                        <input type="text" placeholder="Published" name="published" className="border border-gray-300 p-2 rounded-lg" value={bookInfo.published} onChange={handleChange} />
                        <input type="text" placeholder="ISBN" name="isbn" className="border border-gray-300 p-2 rounded-lg" value={bookInfo.isbn} onChange={handleChange} />

                        <select name="genre" className="border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                            <option value="">Select a genre</option>
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}

                            <option value="genre">Genre</option>
                        </select>
                        <select name="language" className="border border-gray-300 p-2 rounded-lg" onChange={handleChange}>
                            <option value="">Select a language</option>
                            {languages.map((language) => (
                                <option key={language} value={language}>{language}</option>
                            ))}
                        </select>
                        <input type="text" placeholder="Publisher" name="publisher" className="border border-gray-300 p-2 rounded-lg" value={bookInfo.publisher} onChange={handleChange} />
                        <input type="file" accept="image/*" id="cover" name="cover" onChange={(e) => setBookInfo(prev => ({ ...prev, cover: e.target.files[0] }))} />

                    </div>
                    <div className="flex justify-between gap-5">
                        <button type="submit" className="bg-crayola text-white px-4 py-2 rounded-lg" >Add book</button>
                        <button type="button" onClick={toggleAddBook}>Cancel</button>
                    </div>
                </form>
                {message.type === "success" && <Alert severity="success" className="mt-2">{message.content}</Alert>}
                {message.type === "error" && <Alert severity="error" className="mt-2">{message.content}</Alert>}

            </div>
        </div>
    );
}

export default AddBook;
