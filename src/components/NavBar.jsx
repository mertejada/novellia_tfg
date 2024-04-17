import React, { useState, useEffect, useRef } from "react";
import logoImg from '../assets/img/logo.png';

import appFirebase from '../services/firebase';
import { getAuth, signOut } from 'firebase/auth'; 

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const auth = getAuth(appFirebase);

const NavBar = ({ isLoggedIn, isAdmin }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const renderAdminNav = () => (
        <>
            <div className="flex items-center space-x-4 font-medium">
                <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Books</a>
                <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Users</a>
            </div>
            <div className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <span onClick={() => signOut(auth)}>Log out</span>
                <LogoutIcon />
            </div>
        </>
    );
    

    const renderUserNav = () => (
        <>
            <div className="flex items-center space-x-4 font-medium">
                <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Home</a>
                <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Discover</a>
                <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Bookshelf</a>
            </div>
            <div className="relative" ref={menuRef}>
                {auth.currentUser.photoURL ? (
                    <img
                        src={auth.currentUser.photoURL}
                        className="h-8 w-8 rounded-full cursor-pointer"
                        alt="User"
                        onClick={toggleMenu}
                    />
                ) : (
                    <AccountCircleIcon className="cursor-pointer" onClick={toggleMenu} />
                )}
                {isMenuOpen && (
                    <div className="absolute top-10 right-0 w-40 bg-white border border-gray-200 rounded shadow-md">
                        <ul className="py-2">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={toggleMenu}>
                                <SettingsIcon className="mr-2" />
                                Settings
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => signOut(auth)}>
                                <LogoutIcon className="mr-2" />
                                Log out
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <nav className="bg-white sticky top-0 border-b border-gray-200 z-10">
            <div className="shadow-lg flex justify-between items-center p-6 pl-8 pr-8">
                <a href="#" className="flex items-center space-x-2">
                    <img src={logoImg} className="h-8" alt="Novellia Logo" />
                </a>
                {isLoggedIn && (
                    (isAdmin) ? (renderAdminNav()) : (renderUserNav())
                )}
            </div>
        </nav>
    );
};

export default NavBar;
