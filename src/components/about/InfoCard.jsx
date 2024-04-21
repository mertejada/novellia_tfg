import React from "react";

import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import TimelineIcon from '@mui/icons-material/Timeline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

const InfoCard = ({ color, title, text, icon }) => {
    let icons = [
        <LocalLibraryIcon style={{ color: color  }} fontSize= "large"/>,
        <TimelineIcon style={{ color: color }} fontSize= "large"/>,
        <FindInPageIcon style={{ color: color }} fontSize= "large"/>,
        <BookmarkAddIcon style={{ color: color }} fontSize= "large"/>
        
        
    ];


    return (
        <div className="w-2/3 sm:w-1/3 border rounded-xl border-gray-300 shadow-lg bg-white hover:bg-gray-100 transition-colors duration-200 ease-in-out p-4 ">
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="text-4xl flex flex-col items-center justify- center gap-2">
                    {icons[icon]}
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3></div>
                <div className="text-center flex flex-col gap-5">
                    <p >{text}</p>
                </div>
            </div>
        </div>
    );
}

export default InfoCard;
