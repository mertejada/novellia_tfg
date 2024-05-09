import React, { useEffect, useState } from "react";
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

import ListElement from "./ListElement";
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddList from "./AddList";

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Lists = () => {
    const [showAddList, setShowAddList] = useState(false);
    const { user, userLists } = useAuth();

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
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}><CircularProgress /></Box>
            )}
        </div>
    );
};

export default Lists;
