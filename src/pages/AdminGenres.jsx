import React from "react";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, deleteDoc, doc, setDoc, where, query, updateDoc } from "firebase/firestore";

import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';

import Alert from '@mui/material/Alert';
import { set } from "firebase/database";


const AdminGenres = () => {
    const [loading, setLoading] = useState(true);
    const [showEditGenre, setShowEditGenre] = useState(false);
    const [genresId, setGenresId] = useState([]);
    const [genreInfo, setGenreInfo] = useState([]);
    const [genreMessage, setGenreMessage] = useState({ type: null, content: null });
    const [message, setMessage] = useState({ type: null, content: null });

    const fetchGenres = async () => {
        setLoading(true);

        const querySnapshot = await getDocs(collection(db, "genres"));
        const genresId = querySnapshot.docs.map(doc => doc.id);
        const genresInfo = querySnapshot.docs.map(doc => doc.data());
        setGenresId(genresId);
        setGenreInfo(genresInfo);
        setLoading(false);
    };

    const deleteGenre = async (genreId) => {
        try {
            // Revisar que no haya libros con ese género
            const querySnapshot = await getDocs(query(collection(db, "books"), where("genre", "==", genreId)));
            if (!querySnapshot.empty) {
                setGenreMessage({ type: "error", content: "Can't delete genre with books associated" });
                return;
            }
            await deleteDoc(doc(db, "genres", genreId));
            setGenreMessage({ type: "success", content: "Genre deleted successfully" });
            fetchGenres();
        } catch (error) {
            console.error("Error deleting genre:", error);
        }
    }


    const addGenre = async (genreName, genreColor) => {
        try {
            const genreDocRef = doc(db, "genres", genreName.toLowerCase());
            await setDoc(genreDocRef, {
                name: genreName,
                color: genreColor
            });
            setMessage({ type: "success", content: "Genre added successfully" });
            fetchGenres();
        } catch (error) {
            console.error("Error adding genre:", error);
        }
    }


    const editGenre = async (genreId, genreName, genreColor) => {
        try {
            const genreDocRef = doc(db, "genres", genreId);
            await updateDoc(genreDocRef, {
                name: genreName,
                color: genreColor
            });
            setGenreMessage({ type: "success", content: "Genre edited successfully" });
            fetchGenres();
        } catch (error) {
            console.error("Error editing genre:", error);
        }
    }


    useEffect(() => {
        fetchGenres();
    }, []);

    return (
        <div className="content">
            <h1 className="text-4xl mb-4 font-playfair font-extrabold self-start">Genres panel</h1>

            <div className="p-4 rounded-md border border-gray-300 shadow-md">
                <h2 className="text-2xl text-black">Add new genre</h2>
                <form onSubmit={(e) => { e.preventDefault(); addGenre(e.target[0].value, e.target[1].value) }}>
                    <input type="text" placeholder="Genre name" className="w-full border border-gray-300 rounded-md p-2" />
                    <input type="color" className=" rounded-md " />
                    <button className="bg-blue-500 text-white p-2 rounded-md mt-2">Add genre</button>
                </form>
                {message.type === "success" && <Alert severity="success" className="mt-2">{message.content}</Alert>}

            </div>

            {loading ? <p>Loading...</p> :
                <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        genresId.map((genre, index) => (
                            <div key={genre} className="p-4 rounded-md border border-gray-300 shadow-md" >
                                <form onSubmit={(e) => { e.preventDefault(); editGenre(genre, e.target[0].value, e.target[1].value) }}>
                                    <input type="text" placeholder="Genre name" defaultValue={genreInfo[index].name} className="w-full border border-gray-300 rounded-md p-2" />
                                    <input type="color" defaultValue={genreInfo[index].color} className=" rounded-md " />
                                    <button className="bg-blue-500 text-white p-2 rounded-md mt-2" >Edit genre</button>
                                </form>
                                <button onClick={() => deleteGenre(genre)} className="text-red-500 py-3"><DeleteIcon />Delete genre</button>
                            </div>

                        ))}

                </div>
            }
            {genreMessage.type === "success" && <Alert severity="success" className="mt-2">{genreMessage.content}</Alert>}
            {genreMessage.type === "error" && <Alert severity="error" className="mt-2">{genreMessage.content}</Alert>}
        </div>
    )
}

export default AdminGenres;