import React, { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

import About from "../components/about/About";
import HomeIntro from "../components/home/HomeIntro";
import NewBooks from "../components/home/NewBooks";
import UserRegister from "../components/userRegister/UserRegister";
import RecommendedBook from "../components/home/RecommendedBook";


const Home = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [userGenres, setUserGenres] = useState(null); // Added state for userGenres
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.uid) {
            const userDocRef = doc(db, 'users', user.uid);

            const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    setUserInfo(userData.userInfo);
                    setUserGenres(userData.genres);
                    setShowForm(!userData.userInfo);
                } else {
                    console.log('No data available');
                }
            }, (error) => {
                console.error('Failed to fetch user data:', error);
            });

            return () => unsubscribe(); // Clean up the listener when the component unmounts or when user changes
        }
    }, [user]);

    const handleClose = () => {
        setShowForm(false); // Use React state to control visibility
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
