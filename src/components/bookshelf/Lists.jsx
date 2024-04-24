import React, { useEffect, useState } from "react";
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

import ListElement from "./ListElement";
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddList from "./AddList";

const Lists = () => {
    const [userLists, setUserLists] = useState(null);
    const [showAddList, setShowAddList] = useState(false);
    const { user } = useAuth();

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

    const handleListCreation = () => {
        setShowAddList(true);
    }

    const handleClose = () => {
        setShowAddList(false);
    };


    const defaultLists = ['currentlyReading', 'wishList', 'favourites', 'finishedBooks'];

    return (
        <div className="content">
            {userLists ? (
                <>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <li className="flex items-center justify-between h-28 m-2 px-10 bg-gray-100 rounded-xl cursor-pointer" onClick={handleListCreation}>
                            <div className="flex gap-4">
                                <AddBoxIcon />
                                <h2 className="text-gray-800">Create a new list</h2>
                            </div>
                        </li>
                        {Object.keys(userLists)
                            .filter(listName => defaultLists.includes(listName))
                            .sort()
                            .map(listName => (
                                <ListElement key={listName} name={listName} />
                            ))}

                        {Object.keys(userLists)
                            .filter(listName => !defaultLists.includes(listName)) 
                            .sort()
                            .map(listName => (
                                <ListElement key={listName} name={listName} />
                            ))}

                        
                    </ul>
                    {showAddList && <AddList handleClose={handleClose} currentUserLists={userLists} />}
                </>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Lists;
