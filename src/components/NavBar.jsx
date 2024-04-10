import React from "react";
import logoImg from '../assets/img/logo.png';

import appFirebase from '../services/firebase';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(appFirebase);

const NavBar = ({ isLoggedIn }) => {


    return (
        <nav class="bg-white sticky top-0 p-4 border-b border-gray-200 z-10">
            <div class="max-w-screen-xl mx-auto px-4 justify-between flex items-center py-3">
                <a href="#" class="flex items-center space-x-2">
                    <img src={logoImg} class="h-8" alt="Flowbite Logo" />
                </a>
                {isLoggedIn ?
                <div class="flex items-center space-x-4">
                    <a href="#" class="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Home</a>
                    <a href="#" class="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">About</a>
                    <a href="#" class="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Services</a>
                    <a href="#" class="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">Contact</a>
                </div> : null}
                <div>
                    {isLoggedIn ? 
                    <img src={auth.currentUser.photoURL} class="h-8 w-8 rounded-full" alt="User" onClick={() => signOut(auth)} />
                    : null}

                </div>
            </div>
        </nav>
    )
}

export default NavBar;