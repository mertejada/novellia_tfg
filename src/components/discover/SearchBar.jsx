import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
    return (
        <div className=" relative w-1/3">
            <SearchIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',color:'black', zIndex: '1' }} />
            <input
                type="text"
                className="w-full border  rounded-lg pl-10 p-2 pr-4 opacity-80"
                placeholder="Search for a book"
            />
        </div>
    );
}

export default SearchBar;
