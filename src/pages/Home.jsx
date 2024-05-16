import React, { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

import About from "../components/about/About";
import HomeIntro from "../components/home/HomeIntro";
import NewBooks from "../components/home/NewBooks";
import UserRegister from "../components/userRegister/UserRegister";


const Home = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.uid) { // Ensures user is not null and has a uid
            const fetchUserData = async () => {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        const userInfoData = userDocSnapshot.data().userInfo;
                        setUserInfo(userInfoData);
                        setShowForm(!userInfoData);
                    } else {
                        console.log('No data available');
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            };

            fetchUserData();
        }
    }, [user, userInfo]); // Added userInfo to dependencies

    const handleClose = () => {
        setShowForm(false); // Use React state to control visibility
    }

    return (
        <>
        <main>
            {showForm && <UserRegister handleClose={handleClose} />}

            <HomeIntro id="about-info"/>
            <div id="new-books" className="p-2"></div>
            <NewBooks />

            <div id="about" className="p-2"></div>
            <About />
        </main>


        </>
    );
};

export default Home;
