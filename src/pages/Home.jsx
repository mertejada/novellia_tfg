import React, { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

import About from "../components/about/About";
import HomeIntro from "../components/home/HomeIntro";
import NewBooks from "../components/home/NewBooks";
import UserRegister from "../components/userRegister/UserRegister";
import RecommendedBook from "../components/home/RecommendedBook";

/**
 * 
 * @returns Home page
 */
const Home = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [userGenres, setUserGenres] = useState(null); 
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();

    // Fetch user data
    useEffect(() => {
        if (user && user.uid) {
            const userDocRef = doc(db, 'users', user.uid);

            /**
             * Fetch user data
             * @param {Object} docSnapshot 
             * @returns {void}
             */
            const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    setUserInfo(userData.userInfo);
                    setUserGenres(userData.genres);
                    setShowForm(!userData.userInfo); // Show form if not user info
                } else {
                    console.log('No data available');
                }
            }, (error) => {
                console.error('Failed to fetch user data:', error);
            });

            return () => unsubscribe(); 
        }
    }, [user]);

    // Close form
    const handleClose = () => {
        setShowForm(false); 
    }

    return (
        <main className="">
            {showForm && <UserRegister handleClose={handleClose} />}
            <HomeIntro id="about-info"/>

            <div id="new-books"></div>
            <NewBooks />
            <RecommendedBook userGenres={userGenres} />

            <div id="about"></div>
            <About />
        </main>
    );
};

export default Home;
