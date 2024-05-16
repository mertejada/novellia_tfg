import React, { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress';

const DailyReading = ({userInfo, goals}) => {
    const [readingSessions, setReadingSessions] = useState([])
    const [todaysReading, setTodaysReading] = useState(0)

    useEffect(() => {
        getTodaysReading()
    },[readingSessions])

    const getTodaysReading = () => {

        setReadingSessions(userInfo.readingSessions)
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

    return (
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
    )
}

export default DailyReading;