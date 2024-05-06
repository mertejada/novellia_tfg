import React from "react";
import { useState } from "react";

import bkImg from "../assets/testdiscover.png";

import AddIcon from '@mui/icons-material/Add';
import SearchBar from "../components/discover/SearchBar";
import AddBook from "../components/discover/AddBook";
import Books from "../components/discover/Books";

const Discover = () => {
    const [showAddBook, setShowAddBook] = useState(false);

    const toggleAddBook = () => {
        setShowAddBook(!showAddBook);
    }


    return (
        <>

            <div className=" bg-white py-20  flex flex-col justify-center items-center gap-5" style={{ backgroundImage: `url(${bkImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <h1 className=" text-8xl font-bold font-playfair text-center   text-white">Discover</h1>
                <h2 className="text-4xl font-light"><span className="text-gradient gradient">what everybody else's reading</span></h2>


                <div className="content flex justify-center items-center w-full gap-5">
                    <SearchBar />
                    <button className="border-2 p-2 rounded-lg flex gap-2 text-white" onClick={toggleAddBook}>
                        <AddIcon    />
                        Add book
                    </button>
                    
                </div>
            </div>

            <Books />

            {showAddBook && <AddBook toggleAddBook={toggleAddBook} />}

        </>

    );
}

export default Discover;