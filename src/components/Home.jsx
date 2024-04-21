import React, { useEffect, useState } from "react";
import appFirebase from '../services/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import UserRegister from "./UserRegister";
import { useAuth } from '../context/AuthContext';

const Home = () => { 
    const [userInfo, setUserInfo] = useState(true);
    const { user, isAdmin } = useAuth();
    
    useEffect(() => {
        if (user) {  // Ensure user and user.uid are not null or undefined
            const fetchUserData = async () => {
                try {
                    const db = getFirestore(appFirebase);
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
        </div>
    );
};

export default Home;
