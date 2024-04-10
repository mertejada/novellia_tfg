import React from "react";
import logoImg from '../assets/img/logo.png';

import appFirebase from '../services/firebase';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(appFirebase);

const NavBar = ({ isLoggedIn }) => {


    return (
        <nav className="bg-white sticky top-0 p-4 border-b border-gray-200 z-10">
            <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center py-3">
                <a href="#" className="flex items-center space-x-2">
                    <img src={logoImg} className="h-8" alt="Flowbite Logo" />
                </a>
                {isLoggedIn && (
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Home</a>
                        <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">About</a>
                        <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Services</a>
                        <a href="#" className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Contact</a>
                    </div>
                )}
                {isLoggedIn && (
                    <div>
                        <img src={auth.currentUser.photoURL} className="h-8 w-8 rounded-full cursor-pointer" alt="User" onClick={() => signOut(auth)} />
                    </div>
                )}
            </div>
        </nav>

    )
}

export default NavBar;