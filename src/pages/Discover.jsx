import React from "react";
import { useState } from "react";

import AddBoxIcon from '@mui/icons-material/AddBox';

import SearchBar from "../components/discover/SearchBar";
import AddBook from "../components/discover/AddBook";

const Discover = () => {
    const [showAddBook, setShowAddBook] = useState(false);

    const toggleAddBook = () => {
        setShowAddBook(!showAddBook);
    }


    return (
        <>
        
        <div className="content flex items-center">
            <SearchBar />
            <AddBoxIcon onClick={toggleAddBook} toggleAddBook={toggleAddBook} />
        </div>
        
        {showAddBook && <AddBook toggleAddBook={toggleAddBook} />}

        </>

    );
}

export default Discover;