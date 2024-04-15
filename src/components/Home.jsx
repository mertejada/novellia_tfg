import React, { useEffect, useState } from "react";
import appFirebase from '../services/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import UserRegister from "./UserRegister";

const auth = getAuth(appFirebase);

const Home = ({ userMail }) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const db = getFirestore(appFirebase);
                const userDocRef = doc(db, 'users', auth.currentUser.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                
                if (userDocSnapshot.exists()) {
                    console.log(userDocSnapshot.data());
                } else {
                    console.log('No data available');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, [userMail]);

    return (
        <div>
            {!userInfo && <UserRegister />}
        </div>
    );
};

export default Home;
