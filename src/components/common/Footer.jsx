import React from "react";
import { Link } from "react-router-dom";
import logoImg from '../../assets/img/logo.png';
import { useAuth } from "../../contexts/AuthContext";


const Footer = () => {
    const { user, isAdmin } = useAuth();

    const links =
        isAdmin ? [
            { name: "Books", path: "/" },
            { name: "Genres", path: "/genres" }]
            :
            [
                { name: "Home", path: "/home" },
                { name: "Discover", path: "/discover" },
                { name: "Bookshelf", path: "/bookshelf" }
            ];

    return (
        <footer className="bg-white rounded-2xl shadow shadow-zinc-400 dark:bg-gray-900 m-4 mt-20 static bottom-0">
            <div className="w-full max-w-screen-xl mx-auto p-8 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src={logoImg} className="h-8" alt="Flowbite Logo" />
                    </a>
                    <h2 className="text-lg  font-light text-gray-800 dark:text-gray-100">Your adventure starts in <span className="font-extrabold font-playfair text-gradient gradient text-2xl">Novellia.</span></h2>

                </div>
                {user && <>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <div className="sm:flex sm:items-center sm:justify-between ">

                        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 text-gradient gradient">
                            {links.map((link) => (
                                <li key={link.name} className="mr-4">
                                    <Link to={link.path} className="hover:underline">{link.name}</Link>
                                </li>
                            ))}

                            <li> <a href="https://github.com/mertejada/novellia_tfg" className="hover:underline">Github</a></li>
                        </ul>


                    </div>
                </>
                }
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite™</a>. All Rights Reserved.</span>
            </div>
        </footer>
    )
}

export default Footer;