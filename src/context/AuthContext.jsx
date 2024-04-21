// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import appFirebase from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const auth = getAuth(appFirebase);  // Ensure auth is created correctly

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setIsAdmin(user.email === "admin@novellia.com");
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        });

        return () => unsubscribe(); // Correctly unsubscribe on component unmount
    }, [auth]);  // Include auth in the dependency array to capture changes

    const logout = () => {
        signOut(auth).then(() => {
            console.log("Sign out successful");
        }).catch((error) => {
            console.error("Sign out error:", error);
        });
    };


    const value = { user, isAdmin, auth, logout };  // Include auth in the context value

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
