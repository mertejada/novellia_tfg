import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";




import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddToList from "../common/AddToList";
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';

import VerifiedBook from '../common/VerifiedBook';


const BookElement = ({ bookInfo, bookId, isList, listName, isAdmin, fetchBooks }) => {

    const navigate = useNavigate();
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

    const adminDeleteBook = async () => {
        try {
            await deleteDoc(doc(db, "books", bookId));
            fetchBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
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
                            {bookInfo.adminVerified  && <VerifiedBook fontSize="small" />}
                            {bookInfo.title}</h3>

                        <p className="text-sm text-crayola overflow-ellipsis" style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bookInfo.author}</p>
                        <p className="text-sm text-gray-400">{bookInfo.language}</p>


                    </div>

                    {isAdmin ?
                        <div className=" w-1/3 flex justify-end gap-5">
                            <DeleteIcon className="cursor-pointer text-red-500" onClick={adminDeleteBook} />

                        </div> :
                        <div className=" w-1/3 flex justify-end gap-5">
                            <PlaylistAddIcon className="cursor-pointer text-crayola" onClick={toggleAddToList} />
                            {showAddToList && <AddToList toggleAddToList={toggleAddToList} bookId={bookId} className="absolute bottom-20" />}
                        </div>
                    }

                </div>


                {
                    isAdmin ?
                        <button
                            className=" bg-gray-300 text-white p-2 rounded-lg mt-4 w-full " onClick={() => navigate(`/admin/books/${bookId}`)}
                        >
                            <span>Edit book</span>
                        </button>
                        :
                        <button
                            className="bg-gray-300 text-white p-2 rounded-lg mt-4 w-full "
                            onClick={() => navigate(`/book/${bookId}`)}
                        >
                            See more
                        </button>

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
