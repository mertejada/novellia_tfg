import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";




import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddToList from "../common/AddToList";
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';

import VerifiedBook from '../common/VerifiedBook';


const BookElement = ({ bookInfo, bookId, isList, listName, isAdmin, getBooks }) => {
    const { user, userLists } = useAuth();

    const [showAddToList, setShowAddToList] = useState(false);

    const toggleAddToList = () => {
        setShowAddToList(!showAddToList);
    }

    const deleteBookFromList = async () => {
        try {
            if (userLists && userLists[listName]) {
                const updatedList = userLists[listName].filter(id => id !== bookId);

                // Obtener el documento del usuario
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    // Obtener el objeto actual de "lists" del documento del usuario
                    const userData = userDoc.data();
                    const lists = userData.lists || {};

                    // Actualizar la lista específica dentro del objeto "lists"
                    lists[listName] = updatedList;

                    // Actualizar el documento del usuario con el nuevo objeto de "lists"
                    await updateDoc(userRef, { lists });

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

    const deleteBook = async () => {
        try {
            await deleteDoc(doc(db, "books", bookId));
            getBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    }

    const handleScrollTop = () => {
        window.scrollTo(0, 0);
    }


    return (
        <div className="book-element bg-white py-10 rounded-lg border shadow-md flex items-center flex-col">
            <img
                src={bookInfo.cover}
                alt={bookInfo.title}
                className="w-46 h-72 object-cover rounded-lg img-shadow"
            />
            <div className="w-2/3 mt-10 ">
                <div className=" w-full flex items-center justify-evenly gap-10 relative ">
                    <div className="w-2/3">
                        <h3 className="text-lg font-semibold overflow-ellipsis" style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {bookInfo.adminVerified !== "false" && <VerifiedBook fontSize="small" />}
                            {bookInfo.title}</h3>

                        <p className="text-sm text-crayola overflow-ellipsis" style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bookInfo.author}</p>
                        <p className="text-sm text-gray-400">{bookInfo.language}</p>


                    </div>

                    {isAdmin ?
                        <div className=" w-1/3 flex justify-end gap-5">
                            <DeleteIcon className="cursor-pointer text-red-500" onClick={deleteBook} />

                        </div> :
                        <div className=" w-1/3 flex justify-end gap-5">
                            <PlaylistAddIcon className="cursor-pointer text-crayola" onClick={toggleAddToList} />
                            {showAddToList && <AddToList toggleAddToList={toggleAddToList} bookId={bookId} className="absolute bottom-20" bookPages={bookInfo.pages} bookGenre={bookInfo.genre} />}
                        </div>
                    }

                </div>


                {
                    isAdmin ?
                        <div className="flex items-center gap-5">
                            <Link
                                className=" bg-gray-300 text-center text-white p-2 rounded-lg mt-4 w-full " to={`/admin/books/${bookId}`}
                                onClick={handleScrollTop}>
                                <span>Edit book</span>
                            </Link>
                        </div>
                        :
                        <div className="flex items-center gap-5">
                            <Link
                                className="bg-gray-300 text-white text-center p-2 rounded-lg mt-4 w-full "
                                to={`/book/${bookId}`}
                                onClick={handleScrollTop}
                            >
                                See more
                            </Link>
                        </div>
                }

                {
                    isList && <button
                        className=" text-gray-400 mt-4 w-full text-sm " onClick={deleteBookFromList}
                    >
                        <DeleteIcon className="text-red-500 mr-1" />
                        <span>Remove from list</span>
                    </button>
                }


            </div>
        </div>
    );
}

export default BookElement;
