import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';


import { db } from '../services/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { Link, useLocation, useNavigate } from "react-router-dom";

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import bookIconImg from '../assets/img/book-info-icons/files.png';
import languageIconImg from '../assets/img/book-info-icons/language.png';
import editorialImg from '../assets/img/book-info-icons/signature.png';
import ibanCode from '../assets/img/book-info-icons/barcode-scan.png';

import AddToList from "../components/common/AddToList";
import VerifiedBook from '../components/common/VerifiedBook';
import { set } from 'firebase/database';



const Book = () => {
    const { userLists, user, userRatedBooks } = useAuth();

    const [book, setBook] = useState(null);
    const [bookGenreData, setBookGenreData] = useState(null);
    const [ratingAverage, setRatingAverage] = useState(0);
    const [ratingTimes, setRatingTimes] = useState(0);
    const [showAddToList, setShowAddToList] = useState(false);

    const [loading, setLoading] = useState(true);

    const [hover, setHover] = React.useState(-1);
    const [value, setValue] = React.useState(2);



    const location = useLocation();
    const path = location.pathname;
    const bookId = path.split("/")[2];

    const navigate = useNavigate();


    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "books", bookId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setBook(docSnap.data());
                    setBookGenreData(await getDoc(doc(db, "genres", docSnap.data().genre)));
                    setRatingAverage(Object.values(docSnap.data().rating).reduce((acc, rating) => acc + parseInt(rating), 0) / Object.keys(docSnap.data().rating).length);
                    setRatingTimes(Object.keys(docSnap.data().rating).length);
                    setLoading(false);
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

    const handleRatingChange = async (event) => {
        const rating = event.target.value;

        //que si ya existe el libro en ratedBooks, se actualice el rating
        if (userRatedBooks && userRatedBooks[bookId]) {
            const ratedBooks = { ...userRatedBooks, [bookId]: rating };
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                ratedBooks: ratedBooks
            });
        } else {
            const ratedBooks = { ...userRatedBooks, [bookId]: rating };
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
                ratedBooks: ratedBooks
            }, { merge: true });
        }

        //que se actualice el rating del libro. el rating es un array con todos los ratings de los usuarios que han calificado el libro
        const bookDocRef = doc(db, "books", bookId);
        const bookDocSnap = await getDoc(bookDocRef);
        const bookData = bookDocSnap.data();
        const bookRating = bookData.rating;
        const newBookRatings = { ...bookData.rating, [user.uid]: rating };

        //quiero que se guarde en el rating del libro el rating del usuario
        await updateDoc(bookDocRef, {
            rating: newBookRatings
        });

        //quiero que se actualice el rating promedio del libro

        const ratingAverage = Object.values(newBookRatings).reduce((acc, rating) => acc + parseInt(rating), 0) / Object.keys(newBookRatings).length;
        setRatingAverage(ratingAverage);
        setRatingTimes(Object.keys(newBookRatings).length);

    }

    const labels = {
        0: '🤮',
        1: '😪',
        2: '🥱',
        3: '😉',
        4: '😇',
        5: '😍',
    };

    function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }


    return (
        <main className="content p-5">
            <div className="flex items-center mb-8">
                <button className="text-zinc-200" onClick={() => navigate(-1)}>
                    <div className="flex items-center gap-2">
                        <ArrowBackIosIcon />
                        <h1 className="text-2xl font-semibold ml-4 text-zinc-200">Back</h1>
                    </div>
                </button>

            </div>

            {loading ? <p>Loading...</p> : (
                <div className="flex flex-col sm:flex-row gap-10">
                    <div className="w-full sm:w-2/5 md:w-1/5 flex flex-col items-center gap-3 relative ">
                        <img src={book.cover} alt={book.title} className="rounded-lg  w-full h-auto" />
                        <div className='relative w-full'>
                            <div className="flex items-center p-3 cursor-pointer  bg-crayola gap-4 justify-between w-full rounded-md " onClick={toggleAddToList} >
                                <p className="text-white mr-2">Add to list</p>
                                <PlaylistAddIcon className="  text-white" onClick={toggleAddToList} />
                            </div>
                            {showAddToList && <AddToList toggleAddToList={toggleAddToList} bookId={bookId} className="w-52 h-auto  shadow p-5 rounded-lg z-10 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
                        </div>

                        <div className="flex items-center  p-3 relative bg-black gap-4 justify-between w-full rounded-md" >
                            <p className="text-white  cursor-default mr-2">Start session</p>

                            <PlayCircleIcon className="cursor-pointer text-white" />

                        </div>

                    </div>
                    <div className="w-full  sm:w-3/5 md:w-4/5">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-5xl font-bold font-playfair mb-4">
                                    <VerifiedBook verified={book.verified} fontSize="large" />
                                    {book.title}
                                    <span className="text-2xl font-normal text-gray-500">({book.published})</span>
                                </h1>

                            </div>
                            <h2 className="text-xl mb-4 text-crayola">{book.author}</h2>
                            <p to={`/genres/${book.genre}`} style={{ backgroundColor: bookGenreData?.data().color }} className="text-white w-fit px-2 py-1 mb-10 rounded-md">{bookGenreData?.data().name}</p>


                            <Stack spacing={1} direction="row" className="my-4">
                                <Rating
                                    name="simple-controlled"
                                    value={ratingAverage}
                                    onChange={handleRatingChange}
                                    getLabelText={getLabelText}
                                    onChangeActive={(event, newHover) => {
                                        setHover(newHover);
                                    }}
                                />
                                <p className="text-gray-500">( {ratingTimes} ratings )</p>
                                {value !== null && hover !== -1 && (
                                    <Box ml={2}>{labels[hover]}</Box>
                                )}


                            </Stack>

                            <div>
                                <h3 className="text-lg font-normal mb-2">Sipnosis</h3>
                                <p className="text-gray-500">{book.sipnosis}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between mx-16 gap-16 mt-16">
                                <div className="flex flex-col items-center gap-2">
                                    <img src={bookIconImg} alt="Files" className='w-12' />
                                    <div className=" text-center">
                                        <p className=" text-gray-500 mb-0">Pages</p>
                                        <p className="font-semibold">{book.pages}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <img src={editorialImg} alt="Editorial" className='w-12' />
                                    <div className=" text-center">
                                        <p className=" text-gray-500 mb-0">Editorial</p>
                                        <p className="font-semibold">{book.publisher}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <img src={languageIconImg} alt="Language" className='w-12' />
                                    <div className=" text-center">
                                        <p className=" text-gray-500 mb-0">Language</p>
                                        <p className="font-semibold">{book.language}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <img src={ibanCode} alt="IBAN" className='w-12' />
                                    <div className=" text-center">
                                        <p className=" text-gray-500 mb-0">ISBN-10</p>
                                        <p className="font-semibold">{book.isbn}</p>
                                    </div>
                                </div>


                            </div>

                        </div>

                    </div>
                </div>
            )
            }
        </main >
    );
}

export default Book;

