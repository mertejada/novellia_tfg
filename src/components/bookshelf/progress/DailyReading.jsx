import React, { useState, useEffect } from 'react'
import { doc, getDoc } from "firebase/firestore";

import CircularProgress from '@mui/material/CircularProgress';

const DailyReading = ({ userInfo, title }) => {
    const [goals, setGoals] = useState([]);
    const [readingSessions, setReadingSessions] = useState([]);
    const [todaysReading, setTodaysReading] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setReadingSessions(userInfo.readingSessions);
        setGoals(userInfo.readingGoals)

    }, [userInfo])

    useEffect(() => {
        getTodaysReading();
        setLoading(false);
    }, [readingSessions, goals])

    const getTodaysReading = () => {
        let todaysReading = 0;

        if (readingSessions) {
            readingSessions.filter(session => {
                const sessionDate = new Date(session.date);
                const todaysSessions = sessionDate.toDateString() === new Date().toDateString();

                if (todaysSessions) {
                    todaysReading += session.time;
                }
            });
        }

        setTodaysReading(Math.floor(todaysReading / 60));
    }



    return (
        <div className="flex flex-col items-start justify-center border shadow rounded-xl w-full p-10  ">
            <h1 className="text-xl font-bold mb-4">{title}</h1>
            <div className="flex items-end gap-5 justify-center mb-4">
                <CircularProgress
                    variant="determinate"
                    sx={{ color: 'green' }}
                    size={50}
                    thickness={2}
                    value={Math.min(Math.floor((todaysReading / goals.dailyReading) * 100), 100)}
                />
                <div className="">
                    <p> <span className="font-light text-5xl">{todaysReading}</span>  / {goals.dailyReading} min.</p>
                </div>
            </div>
        </div>
    )
}

export default DailyReading;