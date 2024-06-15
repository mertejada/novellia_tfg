import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import crownImg from "../../assets/img/crown.svg";


const ProgressItem = ({ title, content, min, value, reach, greyBg, isTodayProgress }) => {
    let progressColor = reach ? 'green' : 'orange';
    let bg = greyBg ? 'bg-gray-100' : 'bg-white';

    let goalProgress = Math.floor((value / min) * 100);






    return (
        <div className={`flex flex-col items-center justify-center border shadow rounded-xl p-10 ${bg}`}>
            {min <= value &&
                <img src={crownImg} alt="Congratulations Crown" className="mb-3 w-8"
            />}
            <h1 className="text-xl font-bold mb-4">{title}</h1>
            <div className="flex items-end gap-5 justify-center mb-4">
                <Box position="relative" display="inline-flex">
                    {reach && <>
                    <CircularProgress
                        variant="determinate"
                        value={100}
                        sx={{
                            color: 'lightgray',
                        }}
                        size={50}
                        thickness={2}
                    />
                    <CircularProgress
                        variant="determinate"
                        value={Math.min(Math.floor((value / min) * 100), 100)}
                        sx={{
                            color: progressColor,
                            position: 'absolute',
                            left: 0,
                        }}
                        size={50}
                        thickness={2}
                    /></>}
                </Box>
                
                <div>
                    <p>
                        <span className="font-light text-5xl">{value}</span> {reach && "/"} {min} {content}
                    </p>
                </div>
            </div>
            {reach ? (
                <p className="text-sm text-gray-400 text-center">
                                        {goalProgress < 100 ? `You've reached ${goalProgress}% of your goal` : 'You\'ve reached your goal!'}
                </p>
            ) : (
                <p className="text-sm text-gray-400 text-center">What a great progress! Keep going!</p>
            )}
        </div>
    );
};

export default ProgressItem;
