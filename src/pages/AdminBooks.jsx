
import React from 'react';
import { useState } from 'react';
import Books from "../components/discover/Books";
import AddBook from '../components/discover/AddBook';
import SearchBar from '../components/discover/SearchBar';

const AdminBooks = () => {
    const [showAddBook, setShowAddBook] = useState(false);

    const toggleAddBook = () => {
        setShowAddBook(!showAddBook);
    }

    return (
        <main className='sm:content '>
            <div className="flex flex-col mt-10 sm:mt-0 w-full justify-center gap-6 items-center">
                    <h1 className="title w-fit font-bold font-playfair text-center gradient text-gradient">Admin Books</h1>
                    <h2 className="subtitle font-light text-center">Manage all the books</h2>

                <SearchBar isAdmin="true" />
                <button
                    className="button bg-carrot text-white py-2 px-4 rounded"
                    onClick={toggleAddBook}
                >
                    Add Book
                </button>
            </div>
            {showAddBook && <AddBook toggleAddBook={toggleAddBook} adminVerified="true" />}
            <Books isAdmin="true" />
        </main>
    )
}

export default AdminBooks;