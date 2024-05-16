import React, { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress';

const DailyReading = ({ userInfo }) => {
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
        <div className="flex flex-col items-start justify-center border shadow rounded-md w-fit p-10  ">
            <h1 className="text-xl font-bold mb-4">Today's Reading</h1>
            <div className="flex items-end gap-5 justify-center mb-4">
                <CircularProgress
                    variant="determinate"
                    sx={{ color: 'green' }}
                    size={50}
                    thickness={2}
                    //quiero que muestre l que falta para llegar al reading goal
                    value={Math.min(Math.floor((todaysReading / goals.dailyReading) * 100), 100)}
                    className='bg-gray-100 rounded-full'
                />
                <div className="">
                    <p> <span className="font-light text-5xl">{todaysReading}</span>  / {goals.dailyReading} min.</p>
                </div>
            </div>
        </div>
    )
}

export default DailyReading;