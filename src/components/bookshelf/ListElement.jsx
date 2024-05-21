import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BeenhereRounded, BookRounded, FavoriteRounded, ShoppingBasketRounded, DashboardRounded, KeyboardArrowRightRounded } from '@mui/icons-material';


const ListElement = ({ name }) => {
    const navigate = useNavigate();


    //que las minúsculas se conviertan en mayúsculas
    const displayedName = name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, c => c.toUpperCase());

    const icons = {
        "favourites": <FavoriteRounded className="text-red-500" />, // "favourites" is the key, <FavoriteIcon /> is the value
        "wishList": <ShoppingBasketRounded className="text-lavender" />, // "wishList" is the key, <ShoppingBasketIcon /> is the value
        "currentlyReading": <BookRounded className="text-crayola" />,
        "finishedBooks": <BeenhereRounded className="text-green-800" />,
    };

    const handleListRedirection = () => {
        window.scrollTo(0, 0);
        navigate(`/bookshelf/${name}`);
    }


    return (
        <li className=" flex items-center justify-between shadow-md shadow-zinc-400 border h-28 m-2 px-10 bg-white rounded-xl cursor-pointer" onClick={handleListRedirection}>
            <div className="flex gap-4">
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
