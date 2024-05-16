import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { doc, getDoc, where, query, collection } from "firebase/firestore";
import CircularProgress from '@mui/material/CircularProgress';




const Progress = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState();
    const [goals, setGoals] = useState([]);
    const [readingSessions, setReadingSessions] = useState([]);
    const [todaysReading, setTodaysReading] = useState(0);

    const userDocRef = doc(db, 'users', user.uid);


    const getUserInfo = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const userDoc = docSnap.data();
            setUserInfo(userDoc);
            setGoals(userDoc.readingGoals);
            setReadingSessions(userDoc.readingSessions);

        }
    }

    const getTodaysReading = () => {

        let todaysReading = 0;

        readingSessions.filter(session => {
            const sessionDate = new Date(session.date);
            const todaysSessions = sessionDate.toDateString() === new Date().toDateString();

            if (todaysSessions) {
                todaysReading += session.time;
            }

        });

        setTodaysReading(Math.floor(todaysReading / 60));

    }

    useEffect(() => {
        getUserInfo();
        setLoading(false)

    }, [])

    useEffect(() => {
        getTodaysReading();
    }, [userInfo, goals, readingSessions])


    return (
        <div>

            {loading ? <p>Loading...</p> :
                <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold mb-4">Today's Reading</h1>
                <div className="flex items-center mb-4">
                    <p className="mr-2 text-gray-600">You've read:</p>
                    <p className="font-bold">{todaysReading} minutes</p>
                </div>
                <div className="flex items-center mb-8">
                    <p className="mr-2 text-gray-600">Goal for today:</p>
                    <p className="font-bold">{goals.dailyReading} minutes</p>
                </div>
                <CircularProgress 
                    variant="determinate" 
                    value={todaysReading / goals.dailyReading * 100} 
                      size={50}
                      thickness={5}
                /> 
            </div>
            
            }
        </div>
    );
}

export default Progress;