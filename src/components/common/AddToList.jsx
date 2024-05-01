import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { list } from "firebase/storage";

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const AddToList = ({ toggleAddToList, bookInfo }) => {
    const { user } = useAuth();
    const [userLists, setUserLists] = useState(null);
    const addToListRef = useRef(null);

    const bookId = bookInfo.id;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserLists(docSnap.data().lists);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.log("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, [user]);

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
        const updatedLists = {
            ...userLists,
            [listName]: [...userLists[listName], bookId]
        };

        const userDocRef = doc(db, 'users', user.uid);

        updateDoc(userDocRef, {
            lists: updatedLists
        });

        toggleAddToList();
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
        </div>
    );
}

export default AddToList;
