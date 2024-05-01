import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { db, storage } from "../../services/firebase";
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { languages } from "../../data";

const AddBook = ({ toggleAddBook }) => {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);
    const [bookInfo, setBookInfo] = useState({
        title: '',
        author: '',
        sipnosis: '',
        pages: '',
        published: '',
        isbn: '',
        genre: '',
        publisher: '',
        rating: 0,
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
            setError('All fields are required');
            return;
        }

        setError(null);


        try {

            if (!imageFile.type.includes("image/")) {
                setError("Invalid file type");
                return;
            }

            if (imageFile.size > 1000000) {
                setError("File is too big");
                return;
            }

            setError(null);

            let coverUrl = null;

            const storageRef = ref(storage, `covers/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            coverUrl = await getDownloadURL(storageRef);

            bookInfo.cover = coverUrl;


            await addDoc(collection(db, "books"), bookInfo);

        } catch (err) {
            setError(err.message);
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
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default AddBook;
