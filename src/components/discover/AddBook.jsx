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

        //la sipnosis debe tener al menos 50 caracteres
        if (bookInfo.sipnosis.length < 50) {
            setMessage({ type: "error", content: "Sipnosis must be at least 50 characters long" });
            return false;
        }

        //el author solo puede contener caracteres alfabeticos y espacios
        if (!/^[a-zA-Z\s]*$/.test(bookInfo.author)) {
            setMessage({ type: "error", content: "Author must contain only alphabetic characters and spaces" });
            return false;
        }

        //el publisher solo puede contener caracteres alfabeticos y espacios
        if (!/^[a-zA-Z\s]*$/.test(bookInfo.publisher)) {
            setMessage({ type: "error", content: "Publisher must contain only alphabetic characters and spaces" });
            return false;
        }

        if(bookInfo.pages < 1){
            setMessage({ type: "error", content: "Pages must be a valid number" });
            return false;
        }

        //el isbn puede ser ISbN-13 o ISbN-10 con el guion opcional
        if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(bookInfo.isbn)) {
            setMessage({ type: "error", content: "ISBN must be a valid ISBN-13 or ISBN-10" });
            return false;
        }

        return true;
    }


    const addBook = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        const imageInputElement = document.getElementById("cover");
        const imageFile = imageInputElement.files[0];

        if (!validateFormData()) {
            setIsSubmitting(false);
            return;
        }

        setMessage({ type: "none", content: null });


        try {

            //si no añade una imagen, añadir una por defecto

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
            <div className=" bg-white p-4 py-6 sm:p-8 rounded-xl m-20">
                <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-normal"><span className="gradient text-gradient font-light ">Add a</span>  new book</h2>
                <CancelRoundedIcon className="cursor-pointer text-gray-300" onClick={toggleAddBook} />
                </div>

                <form className="grid grid-cols-1 gap-4 sm:p-1 overflow-scroll" onSubmit={addBook} style={{ maxHeight: "60vh" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Title" name="title" className="border border-gray-300 p-2 rounded-lg" value={bookInfo.title} onChange={handleChange} />
                        <input type="text" placeholder="Author" name="author" className="border border-gray-300 p-2 rounded-lg" value={bookInfo.author} onChange={handleChange} />
                        <textarea placeholder="Sipnosis" name="sipnosis" className="border border-gray-300 p-2 rounded-lg h-max" value={bookInfo.sipnosis} onChange={handleChange}></textarea>
                        <input type="number" placeholder="Pages" name="pages" className="border border-gray-300 p-2 rounded-lg" value={bookInfo.pages} onChange={handleChange}  min="1"/>
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
                        <button type="submit" className="bg-crayola text-white px-4 py-2 rounded-lg w-fit" >Add book</button>

                </form>
                {message.type === "success" && <Alert severity="success" className="mt-2">{message.content}</Alert>}
                {message.type === "error" && <Alert severity="error" className="mt-2">{message.content}</Alert>}

            </div>

        </div>
    );
}

export default AddBook;
