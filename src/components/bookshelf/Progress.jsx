import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import CircularProgress from '@mui/material/CircularProgress';

import DailyReading from "./progress/DailyReading";
import DifferentGenres from "./progress/DifferentGenres";
import { get } from "firebase/database";



const Progress = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});


    const getUserInfo = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const userDoc = docSnap.data();
            setUserInfo(userDoc);

        }
        setLoading(false);
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <div>

            {loading ? <p>Loading...</p> :

                <div className="flex  items-center justify-center  gap-10 m-10 ">
                    <DailyReading userInfo={userInfo} title="Today's Reading" />
                </div>

            }
        </div>
    );
}

export default Progress;