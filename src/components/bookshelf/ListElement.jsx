import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BeenhereRounded, BookRounded, FavoriteRounded, ShoppingBasketRounded, DashboardRounded, KeyboardArrowRightRounded } from '@mui/icons-material';

/**
 * 
 * @param {*} name
 * @returns List element component
 */ 
const ListElement = ({ name }) => {
    const navigate = useNavigate();

    // Format the name to be displayed
    const displayedName = name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, c => c.toUpperCase());

    const icons = {
        "favourites": <FavoriteRounded className="text-red-500" />, 
        "wishList": <ShoppingBasketRounded className="text-mariner" />, 
        "currentlyReading": <BookRounded className="text-carrot" />,
        "finishedBooks": <BeenhereRounded className="text-green-800" />,
    };


    return (
        <li className=" flex  xs:flex-row items-center  justify-center xs:justify-between shadow-md shadow-zinc-400 border h-28 xs:m-2 px-2 xs:px-10 bg-white rounded-xl cursor-pointer  transform transition-all duration-150 ease-in-out hover:scale-105" onClick={() => navigate(`/bookshelf/${name}`)}>
            <div className="flex gap-2 sm:gap-4">
                {icons[name] || <DashboardRounded  className="text-gray-500" />}
                <h2 className="truncate overflow-hidden whitespace-nowrap" style={{ maxWidth: "9rem" }}>
                    {displayedName}
                </h2>
            </div>
            <KeyboardArrowRightRounded />
        </li>
    );
};


export default ListElement;
