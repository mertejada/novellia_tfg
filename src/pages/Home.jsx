import React, { useEffect, useState } from "react";
import appFirebase from '../services/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import UserRegister from "../components/userRegister/UserRegister";
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';

import About from "../components/about/About";
import HomeIntro from "../components/home/HomeIntro";


const Home = () => { 
    const [userInfo, setUserInfo] = useState(true);
    const { user, isAdmin } = useAuth();
    
    useEffect(() => {
        if (user) {  // Ensure user and user.uid are not null or undefined
            const fetchUserData = async () => {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnapshot = await getDoc(userDocRef);
                    
                    if (userDocSnapshot.exists()) {
                        setUserInfo(userDocSnapshot.data().userInfo); // Modify state with fetched data
                        console.log(user.uid);
                    } else {
                        console.log('No data available');
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            };

            fetchUserData();
        }
    }, [user]);

    return (
        <div>
            {!userInfo && <UserRegister />}
            <HomeIntro id="about-info" />
            <div id="about-move"></div>
            <About />
        </div>
    );
};

export default Home;
