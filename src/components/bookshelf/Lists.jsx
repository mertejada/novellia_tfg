import React, { useEffect, useState } from "react";
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

import ListElement from "./ListElement";

const Lists = () => {
    const [userLists, setUserLists] = useState(null); // Initialize userLists with null

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

    return (
        <div className="content"> 
            {userLists ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.keys(userLists).map(listName => (
                            <ListElement key={listName} name={listName} />
                        ))}
                    </ul>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Lists;
