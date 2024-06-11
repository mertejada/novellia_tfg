import React from "react";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, deleteDoc, doc, setDoc, where, query, updateDoc } from "firebase/firestore";

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CircularProgress from '@mui/material/CircularProgress';


import Alert from '@mui/material/Alert';


const AdminGenres = () => {
    const [loading, setLoading] = useState(true);
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

                //esos libros cambian su genreId por unknown
                querySnapshot.forEach(async (doc) => {
                    await updateDoc(doc.ref, {
                        genre: "unknown"
                    });
                });
            }
            await deleteDoc(doc(db, "genres", genreId));
            setGenreMessage({ type: "success", content: "Genre deleted successfully" });

            setTimeout(() => {
                setGenreMessage({ type: null, content: null });
            }, 3000);

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
            setTimeout(() => {
                setMessage({ type: null, content: null });
            }, 3000);
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
            setTimeout(() => {
                setGenreMessage({ type: null, content: null });
            }, 3000);
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
            <div className="flex flex-col mt-10 sm:mt-0 w-full justify-center gap-6 items-center">
                <h1 className="title w-fit font-bold font-playfair text-center gradient text-gradient">Genres Panel</h1>
                <div className="p-4 text-center md:w-1/3 bg-gray-200 rounded-md border border-gray-300 shadow-md">
                    <form onSubmit={(e) => { e.preventDefault(); addGenre(e.target[0].value, e.target[1].value) }} className="flex flex-col gap-2 items-center">
                        <div className="flex items-center gap-3 w-full px-4">
                            <label className="text-left">Genre: </label>
                            <input type="text" id="genreName" placeholder="Genre name" className="w-full border border-gray-300 rounded-md p-2" />
                        </div>

                        <div className="flex items-center gap-3 w-full px-4">
                            <label className="text-left">Color: </label>
                            <input type="color" id="genreColor" className=" rounded-md w-full " />
                        </div>
                        <button className="bg-carrot text-white p-2 rounded-md mt-2">Add genre</button>
                    </form>
                    {message.type === "success" && <Alert severity="success" className="mt-2">{message.content}</Alert>}


                </div>
            </div>

            {genreMessage.type === "success" && <Alert severity="success" className="mt-10">{genreMessage.content}</Alert>}
            {genreMessage.type === "error" && <Alert severity="error" className="mt-10">{genreMessage.content}</Alert>}


            {loading ? 
                <div className="flex justify-center items-center h-96">
                    <CircularProgress />
                </div>
            :
                <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">


                    {
                        genresId.map((genre, index) => (
                            <div key={genre} className="p-4 rounded-md border border-gray-300 shadow-md" >
                                <form onSubmit={(e) => { e.preventDefault(); editGenre(genre, e.target[0].value, e.target[1].value) }} className="flex flex-col gap-2 items-center">

                                    <div className="flex items-center gap-3 w-full px-4">
                                        <label className="text-left">Genre: </label>
                                        <input type="text" id="genreName" placeholder="Genre name" defaultValue={genreInfo[index].name} className="w-full border border-gray-300 rounded-md p-2" />
                                    </div>

                                    <div className="flex items-center gap-3 w-full px-4">
                                        <label className="text-left">Color: </label>
                                        <input type="color" id="genreColor" defaultValue={genreInfo[index].color} className=" rounded-md w-full " />
                                    </div>
                                    <div className="flex items-center justify-between gap-3 w-full px-4">
                                    <button onClick={() => deleteGenre(genre)} className="text-red-500 py-3"><DeleteRoundedIcon />Delete genre</button>

                                        <button className=" bg-gray-100 text-carrot px-3 py-1 my-3 rounded-md">Edit genre</button>


                                    </div>
                                </form>
                            </div>

                        ))}

                </div>
            }
        </div>
    )
}

export default AdminGenres;