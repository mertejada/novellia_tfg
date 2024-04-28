import React from "react";
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';

import { db } from '../../services/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

const AddBook = ({toggleAddBook}) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl w-2/3">
                <h2 className="text-2xl font-semibold mb-5">Add a new book</h2>
                <form className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 items-center gap-2">
                    <input type="text" placeholder="Title" className="border border-gray-300 p-2 rounded-lg" />
                    <input type="text" placeholder="Author" className="border border-gray-300 p-2 rounded-lg" />
                    <textarea placeholder="Sipnosis" className="border border-gray-300 p-2 rounded-lg"></textarea>
                    <input type="text" placeholder="Pages" className="border border-gray-300 p-2 rounded-lg" />
                    <input type="text" placeholder="Published" className="border border-gray-300 p-2 rounded-lg" />
                    <input type="text" placeholder="ISBN" className="border border-gray-300 p-2 rounded-lg" />
                    <label htmlFor="cover" className="flex items-center gap-2">
                        <span>Cover</span>
                        <input type="file" id="cover" />
                    </label>
                    </div>
                    <div className="flex justify-between gap-5">
                        <button className="bg-crayola text-white px-4 py-2 rounded-lg" >Add book</button>
                        <button onClick={toggleAddBook}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default AddBook;
