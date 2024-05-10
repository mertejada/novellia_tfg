import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, onSnapshot, updateDoc , collection, getDocs } from "firebase/firestore";
import { useLocation, Link } from "react-router-dom";
import { languages } from "../data";

import { Alert } from "@mui/material"   


const AdminBook = () => {
    const [book, setBook] = useState({});
    const [genres, setGenres] = useState([]);
    const [formData, setFormData] = useState({});
    const location = useLocation();
    const bookId = location.pathname.split("/").pop();

    useEffect(() => {
        const getBook = async () => {
            const docRef = doc(db, "books", bookId);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                setBook(docSnap.data());
                setFormData(docSnap.data()); // Inicializar el estado del formulario con los valores del libro
            } else {
                console.log("No such document!");
            }
    
            const bookDocUnsubscribe = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setBook(doc.data());
                }
            });
    
            return () => {
                bookDocUnsubscribe();
            };
        };
    
        getBook();
    
    }, [bookId]); // Añade las dependencias adecuadas si es necesario para evitar bucles infinitos


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "books", bookId), formData); // Actualizar los datos del libro en la base de datos
            console.log("Book updated successfully!");
        } catch (error) {
            console.error("Error updating book:", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
            setFormData({ ...formData, cover: reader.result }); // Actualiza el estado con la URL de la imagen
        };
    
        if (file) {
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchGenres = async () => {
            const querySnapshot = await getDocs(collection(db, "genres"));
            const genreNames = querySnapshot.docs.map(doc => doc.id);
            setGenres(genreNames);
        };

        fetchGenres();
    }, [bookId]);
    

    return (
        <div className="container mx-auto  py-8">
            <Link to="/admin" className="block mb-4 text-blue-600">Back</Link>
            <h1 className="text-2xl font-bold mb-4">Edit Book</h1>
            <form onSubmit={handleSubmit} >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Title:</label>
                        <input type="text" name="title" value={formData.title || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block mb-1">Author:</label>
                        <input type="text" name="author" value={formData.author || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block mb-1">Genre:</label>
                        <select name="genre" value={formData.genre || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                            <option value="">Select a genre</option>
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>{/* primera letra en mayúscula */
                                    genre.charAt(0).toUpperCase() + genre.slice(1)

                                }</option>
                            ))}
                            
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Pages:</label>
                        <input type="number" name="pages" value={formData.pages || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block mb-1">Year:</label>
                        <input type="number" name="year" value={formData.published || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block mb-1">Description:</label>
                        <textarea name="description" value={formData.sipnosis || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2"></textarea>
                    </div>
                    <div>
                        <label className="block mb-1">Publisher:</label>
                        <input type="text" name="publisher" value={formData.publisher || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block mb-1">Language:</label>
                        <select name="language" value={formData.language || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                            <option value="">Select a language</option>
                            {languages.map((language) => (
                                <option key={language} value={language}>{language}</option>
                            ))}
                        </select>
                        </div>
                    <div>
                        <label className="block mb-1">Cover:</label>
                        <img src={formData.cover} alt={formData.title} className="w-auto h-60 object-cover rounded-md mb-4" />

                        <input type="file" name="cover" onChange={handleImageChange} accept="image/*" className="block mb-2" />
                    </div>

                </div>

                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Update</button>
            </form>
        </div>
    );
};

export default AdminBook;
