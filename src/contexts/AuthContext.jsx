import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import appFirebase from '../services/firebase';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userLists, setUserLists] = useState(null);
    const [userRatedBooks, setUserRatedBooks] = useState(null);
    const auth = getAuth(appFirebase);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserLists(docSnap.data().lists);
                    setUserRatedBooks(docSnap.data().ratedBooks);
                } else {
                    console.log("No such document!");
                }

                setIsAdmin(user.email === "admin@novellia.com");

                // Suscribirse a los cambios en los documentos de usuario
                const userDocUnsubscribe = onSnapshot(docRef, (doc) => {
                    if (doc.exists()) {
                        setUserLists(doc.data().lists);
                        setUserRatedBooks(doc.data().ratedBooks);
                    }
                });

                // Limpieza de la suscripción al desmontar el componente
                return () => {
                    userDocUnsubscribe();
                };
            } else {
                setUser(null);
                setIsAdmin(false);
                setUserLists(null);
                setUserRatedBooks(null);
            }
        });

        // Limpieza de la suscripción al desmontar el componente
        return () => {
            unsubscribeAuth();
        };
    }, [auth]);

    const logout = () => {
        signOut(auth).then(() => {
            console.log("Sign out successful");
        }).catch((error) => {
            console.error("Sign out error:", error);
        });
    };

    const value = { user, isAdmin, auth, logout, userLists, userRatedBooks };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
