import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BeenhereIcon from '@mui/icons-material/Beenhere';
import BookIcon from '@mui/icons-material/Book';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import List from "../../pages/List";


const ListElement = ({ name }) => {
    const navigate = useNavigate();
    const [icon, setIcon] = useState("📚"); // Estado inicial para el ícono


    //que las minúsculas se conviertan en mayúsculas
    const displayedName = name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, c => c.toUpperCase());

    const icons = {
        "favourites": <FavoriteIcon className="text-red-500" />, // "favourites" is the key, <FavoriteIcon /> is the value
        "wishList": <ShoppingBasketIcon className="text-lavender" />, // "wishList" is the key, <ShoppingBasketIcon /> is the value
        "currentlyReading": <BookIcon className="text-crayola" />,
        "finishedBooks": <BeenhereIcon className="text-green-800" />,
    };

    const handleListRedirection = () => {
        navigate(`/bookshelf/${name}`);
    }


    return (
        <li className=" flex items-center justify-between shadow-md shadow-zinc-400 border h-28 m-2 px-10 bg-white rounded-xl cursor-pointer" onClick={handleListRedirection}>
            <div className="flex gap-4">
                {icons[name] || <DashboardRoundedIcon  className="text-gray-500" />}
                <h2 className="truncate overflow-hidden whitespace-nowrap" style={{ maxWidth: "9rem" }}>
                    {displayedName}
                </h2>

            </div>

            <KeyboardArrowRightRoundedIcon />


        </li>
    );
};


export default ListElement;
