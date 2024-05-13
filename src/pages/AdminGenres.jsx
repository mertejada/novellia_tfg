import React from "react";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';


const AdminGenres = () => {
    const [loading, setLoading] = useState(true);
    const [genresId, setGenresId] = useState([]);
    const [genreInfo, setGenreInfo] = useState([]);

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
            await deleteDoc(doc(db, "genres", genreId));
            fetchGenres();
            console.log("Genre deleted successfully!");
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
            fetchGenres();
            console.log("Genre added successfully!");
        } catch (error) {
            console.error("Error adding genre:", error);
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

            </div>
            {loading ? <p>Loading...</p> :


                <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {

                        genresId.map((genre, index) => (
                            <div key={genre} className="p-4 rounded-md border border-gray-300 shadow-md" >
                                <h2 className="text-2xl text-black">{genreInfo[index].name}</h2>
                                <p className="text-gray-500">Color: {genreInfo[index].color}</p>
                                <button onClick={() => deleteGenre(genre)} className="bg-red-500 text-white p-2 rounded-md mt-2"><DeleteIcon /></button>
                            </div>
                        ))}
                </div>

            }

        </div>
    )
}

export default AdminGenres;