import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, getDoc, where, query, collection } from "firebase/firestore";
import CircularProgress from '@mui/material/CircularProgress';

import DailyReading from "./progress/DailyReading";



const Progress = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    const userDocRef = doc(db, 'users', user.uid);


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


            <DailyReading userInfo={userInfo} />
            
            }
        </div>
    );
}

export default Progress;