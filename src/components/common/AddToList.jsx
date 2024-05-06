import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { list } from "firebase/storage";

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import Alert from '@mui/material/Alert';


const AddToList = ({ toggleAddToList, bookId }) => {
    const { user, userLists } = useAuth();
    const addToListRef = useRef(null);

    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addToListRef.current && !addToListRef.current.contains(event.target)) {
                toggleAddToList();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [toggleAddToList]);

    const addBookToList = (listName, bookId, userLists) => {
        if (userLists[listName].includes(bookId)) {
            setError("Book already in list");
            return; // Exit early if the book is already in the list
        } 
    
        const updatedLists = {
            ...userLists,
            [listName]: [...userLists[listName], bookId]
        };
    
        const userDocRef = doc(db, 'users', user.uid);
    
        updateDoc(userDocRef, {
            lists: updatedLists
        }).then(() => {
            setFeedback("Book added to list");
            setTimeout(() => {
                toggleAddToList();
            }, 1000);
        }).catch((error) => {
            console.error("Error adding book to list: ", error);
            setError("Failed to add book to list. Please try again later.");
        });
    }
    


    return (
        <div ref={addToListRef} className="bg-white w-52 h-auto  shadow p-5 rounded-lg z-10 absolute -top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex justify-between items-center text-crayola p-2">
                <h3 className="text-lg">Add to list</h3>
                <PlaylistAddIcon className="cursor-pointer" onClick={toggleAddToList} />
            </div>
            <ul className="p-1 overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: "150px" }}>
                {userLists && Object.keys(userLists).map(listName => (
                    <li key={listName} className="cursor-pointer bg-gray-50 hover:bg-gray-200 my-1 p-2 rounded-lg" onClick={() => addBookToList(listName, bookId, userLists)}>
                        {listName
                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                            .replace(/\b\w/g, c => c.toUpperCase())}
                    </li>
                ))}
            </ul>
            {feedback && <Alert severity="success" className="mt-2">{feedback}</Alert>}
            {error && <Alert severity="error" className="mt-2">{error}</Alert>}
           
        </div>
    );
}

export default AddToList;
