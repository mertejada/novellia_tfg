import React from 'react'

import CircularProgress from '@mui/material/CircularProgress';

const ProgressItem = ({ userGoals, title, content, min, value, reach, greyBg }) => {

    let color = reach ? 'green' : 'orange';
    let bg = greyBg ? 'bg-gray-100' : 'bg-white';

    return (
        <div className={`flex flex-col items-center justify-center  border shadow rounded-xl p-10 ${bg}`}>
            <h1 className="text-xl font-bold mb-4">{title}</h1>
            <div className="flex items-end gap-5 justify-center mb-4">
                {reach && <CircularProgress
                    variant="determinate"
                    sx={{ color: color }}
                    size={50}
                    thickness={2}
                    value={Math.min(Math.floor((value / min) * 100), 100)}
                />}
                <div className="">
                    <p> <span className="font-light text-5xl">{value}</span> {reach && "/"} {min} {content}</p>
                </div>
            </div>
            {reach ? <p className="text-sm text-gray-400 text-center">You've reached {Math.floor((value / min) * 100)}% of your goal</p>
                : <p className="text-sm text-gray-400 text-center">What a great progress! Keep going!</p>
            }
        </div>
    )
}

export default ProgressItem;