
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
        <main>
            <div className="flex w-full justify-center gap-2 items-center">
                
            <SearchBar />
            <button
                className="button bg-crayola text-white py-2 px-4 rounded"
                onClick={toggleAddBook}
            >
                Add Book
            </button>
            </div>
            {showAddBook && <AddBook toggleAddBook={toggleAddBook} adminVerified="true" />}
            <Books isAdmin="true"/>
        </main>
    )
}

export default AdminBooks;