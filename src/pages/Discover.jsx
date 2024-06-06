import React from "react";
import { useState, useEffect } from "react";
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
        <main className="">

            <div className=" bg-white py-20  flex flex-col justify-center items-center gap-5" style={{ backgroundImage: `url(${bkImg})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '45vh' }} width={100} height={100}>
                <h1 className=" title font-bold font-playfair text-center   text-white">Discover</h1>
                <h2 className="subtitle text-center mx-5 font-light"><span className="text-gradient gradient">what everybody else's reading</span></h2>


                <div className=" flex flex-col sm:flex-row justify-center items-center w-full gap-5">
                    <SearchBar />
                    <button className="button bg-crayola rounded-lg flex items-center justify-center gap-2 text-white w-3/4 xs:w-auto" onClick={toggleAddBook}>
                        <AddIcon    adminVerified="false" />
                        Add book
                    </button>
                    
                </div>
            </div>

            <Books />
            {showAddBook && <AddBook toggleAddBook={toggleAddBook}/>}
        </main>

    );
}

export default Discover;