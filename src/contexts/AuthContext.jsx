import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import appFirebase from '../services/firebase';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/**
 * 
 * @param {*} children
 * @returns  Auth context provider
 */
export const AuthProvider = ({ children }) => {
    const auth = getAuth(appFirebase);

    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userLists, setUserLists] = useState(null);
    const [userRatedBooks, setUserRatedBooks] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        /**
         * On auth state change, check if the user is logged in
         */
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setLoading(true); 
            if (user) {
                setUser(user);
                if (user.email === "admin@novellia.com") {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserLists(docSnap.data().lists);
                    setUserRatedBooks(docSnap.data().ratedBooks);
                } else {
                    console.log("No such document!");
                }

                /**
                 * Get user information in real-time updates
                 */
                const userDocUnsubscribe = onSnapshot(docRef, (doc) => {
                    if (doc.exists()) {
                        setUserLists(doc.data().lists);
                        setUserRatedBooks(doc.data().ratedBooks);
                    }
                });

                setTimeout(() => {
                    setLoading(false); 
                }
                , 1000);

                // Cleanup
                return () => {
                    userDocUnsubscribe();
                };
            } else {
                setUser(null);
                setIsAdmin(false);
                setUserLists(null);
                setUserRatedBooks(null);
                setLoading(false);
            }
        });

        // Cleanup
        return () => {
            unsubscribeAuth();
        };
    }, [auth]);

    /**
     * Logout the user
     */
    const logout = () => {
        signOut(auth).then(() => {
            setUser(null);
            setUserLists(null);
            setUserRatedBooks(null);
            console.log("Sign out successful");
        }).catch((error) => {
            console.error("Sign out error:", error);
        });
    };

    const value = { user, isAdmin, auth, logout, userLists, userRatedBooks, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
