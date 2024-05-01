
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import appFirebase from '../services/firebase';
import { set } from 'firebase/database';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userLists, setUserLists] = useState(null);  // Add userLists state
    const auth = getAuth(appFirebase);  // Ensure auth is created correctly

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                    setUserLists(docSnap.data().lists);
                } else {
                    console.log("No such document!");
                }
    
                setIsAdmin(user.email === "admin@novellia.com");
            } else {
                setUser(null);
                setIsAdmin(false);
                setUserLists(null);
            }
        });
    
        return () => unsubscribe();
    }, [auth]);
    



    const logout = () => {
        signOut(auth).then(() => {
            console.log("Sign out successful");
        }).catch((error) => {
            console.error("Sign out error:", error);
        });
    };




    const value = { user, isAdmin, auth, logout, userLists };  // Include userLists in the value object

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

