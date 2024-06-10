import React, { useEffect, useRef, useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

import Alert from '@mui/material/Alert';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const AddToList = ({ toggleAddToList, bookId, bookPages, bookGenre }) => {
    const { user, userLists } = useAuth();
    const addToListRef = useRef(null);

    const [message, setMessage] = useState({ type: null, content: null });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addToListRef.current && !addToListRef.current.contains(event.target)) {
                toggleAddToList();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            setMessage({ type: null, content: null });
        };
    }, []);

    const addBookToList = async (listName) => {
        try {
            if (userLists[listName].includes(bookId)) {
                setMessage({ type: "error", content: "Book already in list" });
                return;
            }
    
            const updatedLists = {
                ...userLists,
                [listName]: [...userLists[listName], bookId]
            };
    
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { lists: updatedLists });

            if(listName == "finishedBooks") {
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.data();
                const finishedBooksInfo = userData.finishedBooksInfo || {};

                finishedBooksInfo[bookId] = {
                    id: bookId,
                    finishedDate: new Date().toISOString(),
                };

                await updateDoc(userDocRef, { finishedBooksInfo });

                console.log("Book added to finishedBooks list")

            }
                

            setMessage({ type: "success", content: "Book added to list" });
        } catch (error) {
            console.error("Error adding book to list: ", error);
            setMessage({ type: "error", content: "Failed to add book to list. Please try again later." });
        }
    }

    
    return (
        <div ref={addToListRef} className="bg-white w-52 h-auto  shadow p-5 rounded-lg z-10 absolute -top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex justify-between items-center text-carrot p-2">
                <h3 className="text-lg">Add to list</h3>
                <CloseRoundedIcon className="cursor-pointer" onClick={toggleAddToList} />
            </div>
            <ul className="p-1 overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: "150px" }}>
                {userLists && Object.keys(userLists).map(listName => (
                    <li key={listName} className="cursor-pointer bg-gray-50 hover:bg-gray-200 my-1 p-2 rounded-lg" onClick={() => addBookToList(listName)}>
                        {listName
                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                            .replace(/\b\w/g, c => c.toUpperCase())}
                    </li>
                ))}
            </ul>
            {message.type === "success" && <Alert severity="success" className="mt-2">{message.content}</Alert>}
            {message.type === "error" && <Alert severity="error" className="mt-2">{message.content}</Alert>}
        </div>
    );
}

export default AddToList;
