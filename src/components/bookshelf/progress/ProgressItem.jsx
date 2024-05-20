import React, { useState, useEffect } from 'react'
import { doc, getDoc } from "firebase/firestore";

import CircularProgress from '@mui/material/CircularProgress';

const ProgressItem = ({ userGoals, title, content, min, value }) => {


    return (
        <div className="flex flex-col items-center justify-center  w-72 h-64 p-10  ">
            <h1 className="text-xl font-bold mb-4">{title}</h1>
            <div className="flex items-end gap-5 justify-center mb-4">
                <CircularProgress
                    variant="determinate"
                    sx={{ color: 'green' }}
                    size={50}
                    thickness={2}
                    value={Math.min(Math.floor((value / min) * 100), 100)}
                />
                <div className="">
                    <p> <span className="font-light text-5xl">{value}</span> / {min} {content}</p>
                </div>
            </div>
        </div>
    )
}

export default ProgressItem;