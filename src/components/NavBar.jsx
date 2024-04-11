import React from "react";
import logoImg from '../assets/img/logo.png';

import appFirebase from '../services/firebase';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(appFirebase);

const NavBar = ({ isLoggedIn, isAdmin }) => {

    const renderAdminNav = () => (
        <><div>
            <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Admin</a>
            <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Users</a>
        </div>
            <button onClick={() => signOut(auth)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign Out</button>
        </>

    );

    const renderUserNav = () => (
        <>
            <div className="flex items-center space-x-4 font-medium">
                <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Home</a>
                <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Discover</a>
                <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Bookshelf</a>
            </div>
            {auth.currentUser.photoURL ? (
                <img
                    src={auth.currentUser.photoURL}
                    className="h-8 w-8 rounded-full cursor-pointer"
                    alt="User"
                    onClick={() => signOut(auth)}
                />
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => signOut(auth)}
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                </svg>
            )}
        </>
    );

    return (
        <nav className="bg-white sticky top-0  border-b border-gray-200 z-10">
            <div className=" shadow-lg flex justify-between items-center p-6 pl-8 pr-8">
                <a href="#" className="flex items-center space-x-2">
                    <img src={logoImg} className="h-8" alt="Flowbite Logo" />
                </a>
                {isLoggedIn && (
                    (isAdmin) ? (renderAdminNav()) : (renderUserNav())
                )}
            </div>

        </nav>

    )
}

export default NavBar;