import React , {useState, useEffect} from 'react'
import { PieChart } from '@mui/x-charts/PieChart';


import CircularProgress from '@mui/material/CircularProgress';


const DifferentGenres = ({userInfo, genres}) => {
    const [goals, setGoals] = useState([]);
    const diffGenres = genres.filter(genre => genre !== userInfo.favoriteGenre)
    useEffect(() => {
        setGoals(userInfo.readingGoals)
    }
    , [userInfo])


    return (
        
        <div className="flex flex-col items-start justify-center border shadow rounded-md w-fit p-10  ">
            <h1 className="text-xl font-bold mb-4">Different genres</h1>
            <div className="flex items-end gap-5 justify-center mb-4">
                <CircularProgress
                    variant="determinate"
                    sx={{ color: 'green' }}
                    size={50}
                    thickness={2}
                    //quiero que muestre l que falta para llegar al reading goal
                    value={Math.min(Math.floor((diffGenres.length / goals.diffGenres) * 100), 100)}
                    className='bg-gray-100 rounded-full'
                />
                <div className="">
                    <p> <span className="font-light text-5xl">{diffGenres.length}</span>  / {goals.diffGenres} min.</p>
                </div>
            </div>
            
        </div>
    )
}

export default DifferentGenres