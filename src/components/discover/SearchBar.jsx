import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const SearchBar = ({isAdmin}) => {
    const [books, setBooks] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const navigate = useNavigate();

    const fetchBooks = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "books"));
            const bookData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBooks(bookData);
        } catch (error) {
            console.error('Error al obtener los libros:', error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleInputChange = (event) => {
        const input = event.target.value;
        setSearchInput(input);
        if (input.trim() !== '') { 
            const filtered = books.filter(book =>
                book.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(input.toLowerCase()) ||
                book.author.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(input.toLowerCase()) ||
                book.isbn.includes(input)
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleRedirection = (id) => () => {
        if(isAdmin){
            navigate(`/admin/books/${id}`);

        }else{
            navigate(`/book/${id}`);
        }
        setSuggestions([]);
        setSearchInput('');
    };

    useEffect(() => {
        const handleClick = (event) => {
            if (event.target.tagName !== 'INPUT') {
                setSuggestions([]);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="relative w-3/4 sm:w-1/2 ">
            <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                <SearchRoundedIcon style={{ color: 'black' }} />
            </div>
            <input
                className='w-full bg-white rounded-full px-10 py-2 border-gray-300 border shadow-md'
                type="text"
                placeholder="Search for books by title, author or ISBN"
                value={searchInput}
                onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-md my-3 z-0 overflow-y-scroll max-h-60">
                    {suggestions.map((book, index) => (
                        <li key={index} className="px-4 py-5 cursor-pointer hover:bg-gray-100" onClick={handleRedirection(book.id)}>
                            <div className='flex items-center' >
                                <img src={book.cover} alt={book.title} className='w-10 object-cover rounded-lg mr-3' />
                                <p className='text-black'>{book.title} -<span className='text-crayola font-light'> {book.author}</span></p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;
