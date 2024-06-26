import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, onSnapshot, updateDoc, collection, getDocs } from "firebase/firestore";
import { useLocation, Link } from "react-router-dom";
import { languages } from "../data";

import { Alert } from "@mui/material"
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CircularProgress from '@mui/material/CircularProgress';


/**
 *
 * @returns AdminBook page
 */
const AdminBook = () => {
    const [book, setBook] = useState({});
    const [genres, setGenres] = useState([]);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState({ type: null, content: null });
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const bookId = location.pathname.split("/").pop();

    // Fetch book data
    useEffect(() => {
        /**
         * Get book data
         * @returns {void}
         */
        const getBook = async () => {
            const docRef = doc(db, "books", bookId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setBook(docSnap.data());
                setFormData(docSnap.data());
            } else {
                console.log("No such document!");
            }

            // Listen for changes on book
            const bookDocUnsubscribe = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setBook(doc.data());
                }
            });

            setLoading(false);

            return () => {
                bookDocUnsubscribe();
            };
        };

        getBook();

    }, []);

    /**
     * Handle form submit
     * @param {*} e 
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            formData.adminVerified = true;
            await updateDoc(doc(db, "books", bookId), formData);
            setMessage({ type: "success", content: "Book updated successfully" });
        } catch (error) {
            setMessage({ type: "error", content: "Error updating book:" + error.message });
        }
    };

    /**
     * Handle image change
     * @param {*} e 
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setFormData({ ...formData, cover: reader.result });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    /**
     * Handle form change
     * @param {*} e 
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            const querySnapshot = await getDocs(collection(db, "genres"));
            const genreNames = querySnapshot.docs.map(doc => doc.id);
            setGenres(genreNames);
        };

        fetchGenres();
    }, [bookId]);

    return (
        <>
            {loading ? <div className="flex justify-center items-center h-screen"><CircularProgress /></div> :

                <main className="content mx-auto  p-8">
                    <div className="flex items-center mb-8">
                        <button className="text-zinc-200" onClick={() => navigate(-1)}>
                            <div className="flex items-center gap-2">
                                <ArrowBackIosIcon />
                                <Link to="/" className="text-zinc-200">Back to admin panel</Link>
                            </div>
                        </button>

                    </div>
                    <h1 className="text-4xl mb-4 font-playfair font-extrabold self-start">Edit book information</h1>

                    <form onSubmit={handleSubmit} >

                        {!book.adminVerified ? <Alert severity="warning" className="mb-4">This book has not been verified by an admin yet.</Alert>
                            :
                            <div className=" rounded-md my-2 mb-10">
                                <VerifiedRoundedIcon className="m-2" color="success" />
                                This book info has been already verified by an admin.
                            </div>
                        }

                        <section className="grid grid-cols-1 md:grid-cols-2 my-10 gap-4 border border-gray-300 rounded-lg p-4 w-full bg-gray-50 shadow-md">

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
                                <textarea name="sipnosis" value={formData.sipnosis || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2"></textarea>
                            </div>
                            <div>
                                <label className="block mb-1">Publisher:</label>
                                <input type="text" name="publisher" value={formData.publisher || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
                            </div>
                            <div>
                                <label className="block mb-1">ISBN:</label>
                                <input type="text" name="publisher" value={formData.isbn || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
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

                            <div className="flex flex-row gap-4">
                                <label className="block mb-1">Cover:</label>
                                <img src={formData.cover} alt={formData.title} className="w-auto h-16 object-cover rounded-md mb-4" />

                                <input type="file" name="cover" onChange={handleImageChange} accept="image/*" className="block mb-2" />
                            </div>

                        </section>

                        {message.type === "success" && <Alert severity="success" className="mb-5">{message.content}</Alert>}
                        {message.type === "error" && <Alert severity="error" className="mb-5">{message.content}</Alert>}

                        <button type="submit" className="button bg-carrot text-white w-52 ">Update
                            {!book.adminVerified ? " and verify" : ""}
                        </button>



                    </form>
                </main>

            }
        </>
    );
};

export default AdminBook;
