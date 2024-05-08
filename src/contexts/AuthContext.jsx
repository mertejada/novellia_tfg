import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import appFirebase from '../services/firebase';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const auth = getAuth(appFirebase);

    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userLists, setUserLists] = useState(null);
    const [userRatedBooks, setUserRatedBooks] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (user.email == "admin@novellia.com") {
                    setIsAdmin(true);
                    return;
                }else{
                    setIsAdmin(false);
                }

                if (docSnap.exists()) {
                    setUserLists(docSnap.data().lists);
                    setUserRatedBooks(docSnap.data().ratedBooks);
                } else {
                    console.log("No such document!");
                }
                const userDocUnsubscribe = onSnapshot(docRef, (doc) => {
                    if (doc.exists()) {
                        setUserLists(doc.data().lists);
                        setUserRatedBooks(doc.data().ratedBooks);
                    }
                });

                return () => {
                    userDocUnsubscribe();
                };
            }
        });

        // Limpieza de la suscripción al desmontar el componente
        return () => {
            unsubscribeAuth();
        };
    }, [auth]);

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

    const value = { user, isAdmin, auth, logout, userLists, userRatedBooks };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
