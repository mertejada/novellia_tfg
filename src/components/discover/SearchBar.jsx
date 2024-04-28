import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {



    return (
        <div className="w-1/3 relative flex items-center">
            <SearchIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'gray' }} />
            <input
                type="text"
                className="w-full border border-gray-300 rounded-lg pl-10 p-2 pr-4"
                placeholder="Search for a book"
            />
        </div>
    );
}

export default SearchBar;
