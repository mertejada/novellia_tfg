import React from "react";
import logoImg from '../../assets/img/logo.png';


const Footer = () => {


    return (
        <footer className="bg-white rounded-2xl shadow shadow-zinc-400 dark:bg-gray-900 m-4 mt-20 static bottom-0">
            <div className="w-full max-w-screen-xl mx-auto p-8 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src={logoImg} className="h-8" alt="Flowbite Logo" />
                    </a>
                    <h2 className="text-lg  font-light text-gray-800 dark:text-gray-100">Your adventure starts in <span className="font-extrabold font-playfair text-gradient gradient text-2xl">Novellia.</span></h2>

                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between ">
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 text-gradient gradient">
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">About</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">Contact</a>
                        </li>
                    </ul>

                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite™</a>. All Rights Reserved.</span>
            </div>
        </footer>
    )
}

export default Footer;