import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { db, storage } from "../../services/firebase";
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { languages } from "../../data";

import Alert from '@mui/material/Alert';
import CancelRoundedIcon from '@mui/icons-material/Cancel';


const AddBook = ({ toggleAddBook, adminVerified }) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState({ type: null, content: null });
    const [genres, setGenres] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClickOutside = (e) => {
        if (e.target.classList.contains('fixed')) {
            toggleAddBook();
        }
    }
    //que si esta el componente montado no haya scroll y al hacer click fuera del modal se cierre
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        //que al hacer click fuera del modal, se cierre


        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

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
        adminVerified: (adminVerified === "true") ? true : false

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

    const validateFormData = () => {
        //segun el tipo de dato que se espera, se valida
        if (typeof bookInfo.author !== "string" || typeof bookInfo.title !== "string") {
            setMessage({ type: "error", content: "Author and title must be strings" });
            return false;
        }

        //el author y el publisher deben tener al menos 3 caracteres
        if (bookInfo.author.length < 3 || bookInfo.publisher.length < 3) {
            setMessage({ type: "error", content: "Author and publisher must be at least 3 characters long" });
            return false;
        }

        //el author y publisher pueden tener letras, espacios, tilde, guion y apostrofe
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(bookInfo.author) || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(bookInfo.publisher)) {
            setMessage({ type: "error", content: "Author and publisher must only contain letters, spaces, hyphens, apostrophes and accents" });
            return false;
        }


        //la sipnosis debe tener al menos 50 caracteres
        if (bookInfo.sipnosis.length < 50) {
            setMessage({ type: "error", content: "Sipnosis must be at least 50 characters long" });
            return false;
        }

        if (bookInfo.pages < 1) {
            setMessage({ type: "error", content: "Pages must be a valid number" });
            return false;
        }

        //el isbn puede ser ISbN-13 o ISbN-10 con el guion opcional
        if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(bookInfo.isbn)) {
            setMessage({ type: "error", content: "ISBN must be a valid ISBN-13 or ISBN-10" });
            return false;
        }

        //EL PUBLISHED TIENE QUE SER UN AÑO VALIDO Y NO PUEDE SER MAYOR AL AÑO ACTUAL
        if (isNaN(bookInfo.published) || bookInfo.published < 0 || bookInfo.published > new Date().getFullYear()) {
            setMessage({ type: "error", content: "Published must be a valid year" });
            return false;
        }


        return true;
    }


    const addBook = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        const imageInputElement = document.getElementById("cover");

        if (!imageInputElement.files[0]) {
            setMessage({ type: "error", content: "You must select a cover image" });
            setIsSubmitting(false);
            return;
        }

        const imageFile = imageInputElement.files[0];



        if (!validateFormData()) {
            setIsSubmitting(false);
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
            bookInfo.pages = parseInt(bookInfo.pages);



            await addDoc(collection(db, "books"), bookInfo);

            setMessage({ type: "success", content: "Book added successfully" });

            setTimeout(() => {
                setMessage({ type: null, content: null });
                setIsSubmitting(false);
                toggleAddBook();
            }, 3000);

        } catch (err) {
            console.error('Error adding book:', err);
            setMessage({ type: "error", content: "Failed to add book. Please try again later." });
        }


    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={handleClickOutside}>
            <div className=" bg-white p-4 py-6 sm:p-8 rounded-xl m-10 md:m-20">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-normal"><span className="gradient text-gradient font-light ">Add a</span>  new book</h2>
                    <CancelRoundedIcon className="cursor-pointer text-gray-300" onClick={toggleAddBook} />
                </div>

                <form className="grid grid-cols-1 gap-4 sm:p-1 overflow-scroll" onSubmit={addBook} style={{ maxHeight: "60vh" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="title">Title:</label>
                            <input type="text" id="title" placeholder="Title of the book" name="title" className="input" value={bookInfo.title} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="author">Author:</label>
                            <input type="text" id="author" placeholder="Author name" name="author" className="input" value={bookInfo.author} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="sipnosis">Sipnosis:</label>
                            <textarea id="sipnosis" placeholder="Book sipnosis" name="sipnosis" className="input" value={bookInfo.sipnosis} onChange={handleChange} required></textarea>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="pages">Pages:</label>
                            <input type="number" id="pages" placeholder="Number of pages" name="pages" className="input" value={bookInfo.pages} onChange={handleChange} min="1" required />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="published">Published:</label>
                            <input type="text" id="published" placeholder="Year of publishment" name="published" className="input" value={bookInfo.published} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="isbn">ISBN:</label>
                            <input type="text" id="isbn" placeholder="ISBN-10 or ISBN-13" name="isbn" className="input" value={bookInfo.isbn} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="genre">Genre:</label>
                            <select id="genre" name="genre" className="input" onChange={handleChange}>
                                <option value="">Select a genre</option>
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="language">Language:</label>
                            <select id="language" name="language" className="input" onChange={handleChange}>
                                <option value="">Select a language</option>
                                {languages.map((language) => (
                                    <option key={language} value={language}>{language}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="publisher">Publisher:</label>
                            <input type="text" id="publisher" placeholder="Publisher" name="publisher" className="input" value={bookInfo.publisher} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="cover">Cover:</label>
                            <input type="file" id="cover" accept="image/*" name="cover" onChange={(e) => setBookInfo(prev => ({ ...prev, cover: e.target.files[0] }))} />
                        </div>
                    </div>
                    <button type="submit" className="bg-carrot text-white button w-fit" >Add book</button>
                </form>
                {message.type === "success" && <Alert severity="success" className="mt-2">{message.content}</Alert>}
                {message.type === "error" && <Alert severity="error" className="mt-2">{message.content}</Alert>}

            </div>

        </div>
    );
}

export default AddBook;
