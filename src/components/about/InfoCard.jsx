import React from "react";

import { LocalLibraryRounded, TimelineRounded, FindInPageRounded, BookmarkAddRounded } from '@mui/icons-material';

/**
 * 
 * @param {*} color
 * @param {*} title
 * @param {*} text
 * @param {*} icon
 * @returns  InfoCard component
 */
const InfoCard = ({ color, title, text, icon }) => {
    let icons = [
        <LocalLibraryRounded style={{ color: color }} fontSize="large" />,
        <TimelineRounded style={{ color: color }} fontSize="large" />,
        <FindInPageRounded style={{ color: color }} fontSize="large" />,
        <BookmarkAddRounded style={{ color: color }} fontSize="large" />
    ];

    return (
        <article className=" w-full sm:w-2/5 flex flex-col items-center justify-center h-64 sm:h-72 border rounded-xl border-gray-300 shadow-lg bg-white hover:bg-gray-100 transition-colors duration-200 ease-in-out p-4 ">
            <div className="text-center flex flex-col items-center justify-center p-6 space-y-4">
                <div className="text-4xl flex flex-col items-center justify- center gap-2">
                    {icons[icon]}
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3></div>
               
                    <p className="h-2/3 pt-1">{text}</p>

            </div>
        </article>
    );
}

export default InfoCard;
