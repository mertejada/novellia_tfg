import React from "react";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

const AdminGenres = () => {
    const [loading , setLoading] = useState(true);
    const [genresId, setGenresId] = useState([]);
    const [genreInfo, setGenreInfo] = useState([]);


    useEffect(() => {
        const fetchGenres = async () => {
            const querySnapshot = await getDocs(collection(db, "genres"));
            const genresId = querySnapshot.docs.map(doc => doc.id);
            const genresInfo = querySnapshot.docs.map(doc => doc.data());
            setGenresId(genresId);
            setGenreInfo(genresInfo);
            setLoading(false);
        };

        fetchGenres();
    }, []);

    return (
        <div className="content">
            <h1 className="text-4xl mb-4 font-playfair font-extrabold self-start">Genres panel</h1>
            {loading ? <p>Loading...</p> :
            

            <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {genresId.map((genre, index) => (
                    <div key={genre} className="p-4 rounded-md border border-gray-300 shadow-md" >
                        <h2 className="text-2xl text-black">{genre.charAt(0).toUpperCase() + genre.slice(1)}</h2>
                    </div>
                ))}

            </div>
            
            }

        </div>
    )
}

export default AdminGenres;