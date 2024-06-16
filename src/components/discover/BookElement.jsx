import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, updateDoc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

import AddToList from "../common/AddToList";


import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import VerifiedBook from '../common/VerifiedBook';

/**
 * @param {*} bookInfo
 * @param {*} bookId
 * @param {*} isList
 * @param {*} listName
 * @param {*} isAdmin
 * @param {*} updateBooks
 * @param {*} genres
 * @returns 
 */
const BookElement = ({ bookInfo, bookId, isList, listName, isAdmin, updateBooks, genres }) => {
    const { user, userLists } = useAuth();
    const [genreColor, setGenreColor] = useState('#FFFFFF');
    const [genreName, setGenreName] = useState('Unknown');

    const [showAddToList, setShowAddToList] = useState(false);

    /**
     * Toggle the AddToList component
     */
    const toggleAddToList = () => {
        setShowAddToList(!showAddToList);
    }

    /**
     * Delete the book from the user's list
     * @returns {void}
     */
    const deleteBookFromList = async () => {
        try {
            if (userLists && userLists[listName]) {
                const updatedList = userLists[listName].filter(id => id !== bookId);

                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const lists = userData.lists || {};

                    lists[listName] = updatedList; // Update the list 

                    await updateDoc(userRef, { lists });

                    if (listName === "finishedBooks") { // If the book was in the finishedBooks list, delete the book
                        const finishedBooksInfo = userData.finishedBooksInfo || {};
                        delete finishedBooksInfo[bookId];
                        await updateDoc(userRef, { finishedBooksInfo });
                    }

                } else {
                    console.error("User document not found!");
                }
            } else {
                console.error("List not found!");
            }
        } catch (error) {
            console.error("Error removing book from list:", error);
        }
    }

    /**
     * Delete the book from the database
     * @returns {void}
     */
    const deleteBook = async () => {
        try {
            // Delete the book document
            await deleteDoc(doc(db, "books", bookId));
    
            // Delete the book from all users' lists
            const usersCollectionRef = collection(db, "users");
            const usersSnapshot = await getDocs(usersCollectionRef);
    
            usersSnapshot.forEach(async (userDoc) => {
                const userData = userDoc.data();
                const userLists = userData.lists || {};
    
                let listsUpdated = false;
    
                for (const listName in userLists) {
                    // If the book is in the list
                    if (userLists[listName].includes(bookId)) {
                        // Delete the book from the list
                        userLists[listName] = userLists[listName].filter(id => id !== bookId);
                        listsUpdated = true;

                        // If the book was in the finishedBooks list, delete the book info
                        if (listName == "finishedBooks") {
                            const finishedBooksInfo = userData.finishedBooksInfo;
                            delete finishedBooksInfo[bookId];
                            await updateDoc(userDoc.ref, { finishedBooksInfo });
                        }
                    }
                }
    
                //Once the search is done, update the user document
                if (listsUpdated) {
                    await updateDoc(userDoc.ref, { lists: userLists });
                }
            });

            updateBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    }

    /**
     * Get the genre info
     * @returns {void}
     */
    const getGenreInfo =  () => {
        genres.map(genre => {
            if (genre.id === bookInfo.genre) {
                setGenreName(genre.name);
                setGenreColor(genre.color);
            }
        }
        );
    }

    // Get the genre info on component mount or when genres change
    useEffect(() => {
        if(genres){
            getGenreInfo();
        }
    }, [genres]);

    return (
        <section className=" bg-white py-10 rounded-lg border shadow-md flex items-center flex-col">
            <img
                src={bookInfo.cover}
                alt={bookInfo.title}
                className="w-46 h-72 object-cover rounded-lg img-shadow"
                width={190}
                height={200}
            />
            <div className="w-4/5 mt-10 ">
                <div className=" w-full flex items-center justify-evenly gap-10 relative ">
                    <div className="w-2/3">
                        <h3 className="text-lg font-semibold overflow-ellipsis" style={{ maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {bookInfo.adminVerified !== false && <VerifiedBook fontSize="small" />}
                            {bookInfo.title}                        
                            
                        </h3>


                        <p className="text-sm text-carrot overflow-ellipsis" style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bookInfo.author}</p>

                        <div className="flex flex-row gap-2 items-center ">
                            <p style={{ backgroundColor: genreColor }} className="text-xs text-white w-fit px-2 py-1 my-1 rounded-md">{genreName}</p>
                            <p className="text-xs text-gray-400">{bookInfo.language}</p>

                        </div>

                    </div>

                    {isAdmin ?
                        <div className=" w-1/3 flex justify-end gap-5">
                            <DeleteRoundedIcon className="cursor-pointer text-red-500" onClick={deleteBook} />

                        </div> :
                        <div className="  flex justify-end items-end gap-5">
                            <PlaylistAddRoundedIcon className="cursor-pointer text-carrot" onClick={toggleAddToList} />
                            {showAddToList && <AddToList toggleAddToList={toggleAddToList} bookId={bookId} className="absolute bottom-20" bookPages={bookInfo.pages} bookGenre={bookInfo.genre} />}
                        </div>
                    }

                </div>


                {
                    isAdmin ?
                        <div className="flex items-center gap-5">
                            <Link
                                className=" bg-gray-300 text-center text-white p-2 rounded-lg mt-4 w-full " to={`/admin/book/${bookId}`}
                            >
                                <span>Edit book</span>
                            </Link>
                        </div>
                        :
                        <div className="flex items-center gap-5">
                            <Link
                                className="bg-gray-300 color-transition hover:bg-gray-400 active:bg-gray-500 text-white text-center p-2 rounded-lg mt-2 w-full "
                                to={`/book/${bookId}`}
                            >
                                See more
                            </Link>
                        </div>
                }

                {
                    isList && <button
                        className=" text-gray-400 mt-4 w-full text-sm " onClick={deleteBookFromList}
                    >
                        <DeleteRoundedIcon className="text-red-500 mr-1" />
                        <span>Remove from list</span>
                    </button>
                }


            </div>
        </section>
    );
}

export default BookElement;
