import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

import { db } from '../services/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { Link, useLocation } from "react-router-dom";

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddToList from "../components/common/AddToList";

const Book = () => {
    const { userLists, user } = useAuth();
    const [book, setBook] = useState(null);
    const [showAddToList, setShowAddToList] = useState(false);
    const location = useLocation();
    const path = location.pathname;
    const bookId = path.split("/")[2];

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const docRef = doc(db, "books", bookId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setBook(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error al obtener el libro:', error);
            }
        };

        fetchBook();
    }, [bookId]);

    const toggleAddToList = () => {
        setShowAddToList(!showAddToList);
    }


    console.log(user);

    return (
        <main className="content p-5">
            <div className="flex items-center mb-8">
                <Link to="/discover" className="text-zinc-200">
                    <div className="flex items-center gap-2">
                        <ArrowBackIosIcon />
                        <h1 className="text-2xl font-semibold ml-4 text-zinc-200">Discover</h1>
                    </div>
                </Link>

            </div>
            {book && (
                <div className="flex flex-col sm:flex-row gap-10">
                    <div className="w-full sm:w-2/5 md:w-1/5 flex flex-col items-center gap-3 ">
                        <img src={book.cover} alt={book.title} className="rounded-lg  w-full h-auto" />
                        <div className="flex items-center p-3 relative bg-crayola gap-4 justify-between w-full rounded-md" >
                            <PlaylistAddIcon className="cursor-pointer text-white" onClick={toggleAddToList} />

                            <p className="text-white text-lg mr-2">Add to list</p>

                            {showAddToList && <AddToList toggleAddToList={toggleAddToList} bookInfo={book} className="w-52 h-auto  shadow p-5 rounded-lg z-10 absolute -top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
                        </div>
                        <div className="flex items-center  p-3 relative bg-black gap-4 justify-between w-full rounded-md" >

                            <PlayCircleIcon className="cursor-pointer text-white" />
                            <p className="text-white text-lg mr-2">Start session</p>

                        </div>

                    </div>
                    <div className="w-full  sm:w-3/5 md:w-4/5">
                        <div>
                            <h1 className="text-5xl font-bold font-playfair mb-4">{book.title}</h1>
                            <h2 className="text-xl mb-4 text-crayola">{book.author}</h2>
                            <Stack spacing={1} direction="row" className="mb-4">
                                <Rating
                                    name="simple-controlled"
                                />
                            </Stack>
                            <p className="text-gray-500">{book.sipnosis}</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Book;
