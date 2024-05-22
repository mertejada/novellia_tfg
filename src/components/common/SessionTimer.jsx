import React, { useState, useEffect } from "react";
import { PlayCircle, StopCircle, PauseCircle, HeartBroken } from "@mui/icons-material";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';

import Alert from '@mui/material/Alert';
import { set } from "firebase/database";


const SessionTimer = ({ setShowSessionTimer }) => {
    const [time, setTime] = useState(0);
    const [timerId, setTimerId] = useState(null); //timerId is used to store the interval id
    const today = new Date();

    const { user } = useAuth();

    const [message, setMessage] = useState({ type: null, content: null });

    let saveColor = time == 0 ? "text-gray-300" : "text-crayola hover:bg-gray-100";
    let restartColor = time == 0 ? "text-gray-300" : "text-red-500 hover:bg-gray-100";

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
        if(time == 0) {
            setMessage({ type: "error", content: "Session time is 0" });

            setTimeout(() => {
                setMessage({ type: null, content: null });
            }
            , 3500);
            return;
        }


        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }

        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const userDoc = docSnap.data();
            const sessions = userDoc.readingSessions || [];
            const session = {
                date: new Date().toISOString(),
                time: time
            };

            sessions.push(session);

            await updateDoc(userDocRef, {
                readingSessions: sessions
            });

        } else {
            await setDoc(userDocRef, {
                readingSessions: [session]
            });
        }

        setMessage({ type: "success", content: "Session saved" });

        setTimeout(() => {
            setShowSessionTimer(false);
        }, 3000);

        console.log("Session saved");
    }

    const handleRestart = () => {
        setTime(0);
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }
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
            <div className="bg-white xs:p-2 sm:p-4 rounded-lg">
                <div className="flex justify-end items-center gap-1 text-gray-300 hover:text-gray-500 transition-all duration-150 ease-in-out">
                    <CloseRoundedIcon className="cursor-pointer m-2" onClick={() => setShowSessionTimer(false)} fontSize="small" />

                </div>
                <div className="flex flex-col justify-center items-center gap-2 text-center p-6">
                    <div className="flex flex-col items-center gap-1">
                        <TimerRoundedIcon />
                        <h2 className="text-xl">Reading session</h2>
                        <p className="text-gradient gradient text-sm">{today.toDateString()}</p>
                    </div>

                    <p className=" text-6xl font-extralight font-poppins">{formatTime(time)}</p>


                    <div className="flex  items-center xs:pl-1 sm:pl-3 mt-5 gap-1   ">
                        
                    <button className={`flex gap-1 font-normal px-2 py-1 items-center justify-center  transition-all duration-150 ease-in-out    hover:bg-gray-100 hover:border-gray-100  rounded-full  border-gray-300 ${saveColor}`} onClick={handleRestart}>
                            <RestartAltRoundedIcon />
                        </button>
                        <button className={`flex gap-1 font-normal px-2 py-1 items-center justify-center  transition-all duration-150 ease-in-out    hover:bg-gray-100 hover:border-gray-100  rounded-full  border-gray-300 ${restartColor}`} onClick={handleStop}>
                            <StopCircle /> Save
                        </button>
                        {!timerId ?

                            (
                                <button className="flex gap-1 font-normal w-28    px-4 py-1 items-center transition-all duration-150 ease-in-out hover:bg-black hover:text-white hover:border-black  rounded-full  border-black text-black" onClick={handlePlay}>
                                    <PlayCircle className="" /> Start
                                </button>
                            )
                            :

                            (
                                <button className="flex gap-2 font-normal w-28   px-4 py-1 items-center   transition-all duration-150 ease-in-out  hover:bg-black hover:text-white hover:border-black  rounded-full  border-black text-black" onClick={handlePause}>
                                    <PauseCircle /> Pause
                                </button>)
                        }
                        
                        
                        



                    </div>


                    {message.type !== null ? <Alert severity={message.type} className="mt-5">{message.content}</Alert> :
                    <p className="text-xs bg-slate-100 text-slate-600 w-48 mt-5 p-3 rounded-xl">Always save your session before closing the window</p>
                    }

                    
                </div>
            </div>
        </div>
    );
}

export default SessionTimer;
