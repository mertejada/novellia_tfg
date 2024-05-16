import React, { useState, useEffect } from "react";
import { PlayCircle, StopCircle, PauseCircle, HeartBroken } from "@mui/icons-material";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

import CloseIcon from '@mui/icons-material/Close';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import Alert from '@mui/material/Alert';


const SessionTimer = ({ setShowSessionTimer }) => {
    const [time, setTime] = useState(0);
    const [timerId, setTimerId] = useState(null); //timerId is used to store the interval id
    const today = new Date();

    const { user } = useAuth();

    const [message, setMessage] = useState({ type: null, content: null });

    const handlePlay = () => {
        if (!timerId) {
            const id = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
            setTimerId(id);
        }
    }

    const handlePause = () => {
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
            return;
        }

        const id = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);
    }

    const handleStop = async () => {
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }

        const userDocRef = doc(db, 'users', user.uid);

        const session = {
            //que se guarde la fecha y la hora en date
            date: today,
            time: time
        }

        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const userDoc = docSnap.data();
            const sessions = userDoc.sessions ? userDoc.sessions : [];
            sessions.push(session);

            await updateDoc(userDocRef, {
                sessions: sessions
            });
        } else {
            await setDoc(userDocRef, {
                sessions: [session]
            });
        }

        setMessage({ type: "success", content: "Session saved" });
        
        setTimeout(() => {
            setShowSessionTimer(false);
        }, 4000);

        console.log("Session saved");
    }

    useEffect(() => {
        return () => {
            clearInterval(timerId);
        };
    }, [timerId]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours > 0 ? hours.toString().padStart(2, '0') : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }


    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-end items-center gap-1 text-gray-300 hover:text-gray-500 transition-all duration-150 ease-in-out">
                    <CloseIcon className="cursor-pointer" onClick={() => setShowSessionTimer(false)} fontSize="small" />

                </div>
                <div className="flex flex-col justify-center items-center gap-2 text-center p-6">
                    <div className="flex flex-col items-center gap-1">
                    <TimerRoundedIcon />
                    <h2 className="text-xl">Reading session</h2>
                    <p className="text-gradient gradient text-sm">{today.toDateString()}</p>
                    </div>
                    
                    <p className=" text-6xl font-extralight font-poppins">{formatTime(time)}</p>


                    <div className="flex justify-center items-center mt-5 ">
                        <button className="flex gap-1 font-normal  px-2 py-1 items-center  transition-all duration-150 ease-in-out text-gray-300  hover:text-red-600 hover:bg-gray-100 hover:border-gray-100  rounded-full  border-gray-300" onClick={handleStop}>
                            <StopCircle /> Save
                        </button>
                        {!timerId ?

                            (
                                <button className="flex gap-1 font-normal  px-2 py-1 items-center  transition-all duration-150 ease-in-out hover:bg-black hover:text-white hover:border-black  rounded-full  border-black text-black" onClick={handlePlay}>
                                    <PlayCircle className="" /> Start
                                </button>
                            )
                            :

                            (
                                <button className="flex gap-1 font-normal  px-2 py-1 items-center  transition-all duration-150 ease-in-out  hover:bg-black hover:text-white hover:border-black  rounded-full  border-black text-black" onClick={handlePause}>
                                    <PauseCircle /> Pause
                                </button>)
                        }



                    </div>

                    
                    {message.type === "success" ?
                        <Alert severity="success" className="mt-2">{message.content}</Alert>
                        :
                        <p className="text-xs bg-slate-100 text-slate-600 w-48 mt-5 p-3 rounded-xl">Always save your session before closing the window</p>
                    }
                </div>
            </div>
        </div>
    );
}

export default SessionTimer;
