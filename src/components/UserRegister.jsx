import React from "react";
import logoImg from '../assets/img/logo.png';

import appFirebase from '../services/firebase';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(appFirebase);

const UserRegister = () => {


    const cancelRegister = () => {
        document.getElementById("infoRegister").style.display = "none";
    }

    return (
        <div id="infoRegister" className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-10/12">
                <h1 className="  mb-10 mt-5 text-3xl">Welcome to <span className="text-4xl gradient text-gradient font-extrabold font-playfair">Novellia!</span></h1>
                <ol className="pb-6 flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base flex-wrap sm:flex-nowrap">
                    <li className=" flex md:w-full items-center text-crayola dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
                        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                        </span>
                    </li>
                    <li class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
                        <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                            <span class="me-2">2</span>
                            Reading <span class="hidden sm:inline-flex sm:ms-2">goals</span>
                        </span>
                    </li>
                    <li class="flex items-center">
                        <span class="me-2">3</span>
                        Interests
                    </li>
                </ol>

                <form className="flex flex-col gap-4 mt-10 mb-10">
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2 gap-2">
                            <label className="text-gray-600 dark:text-gray-400">Nombre</label>
                            <input type="text" placeholder="Nombre" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                        </div>
                        <div className="flex flex-col w-1/2 gap-2">
                            <label className="text-gray-600 dark:text-gray-400">Apellidos</label>
                            <input type="text" placeholder="Apellido" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2 gap-2">
                            <label className="text-gray-600 dark:text-gray-400">Fecha de Nacimiento</label>
                            <input type="date" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                        </div>
                        <div className="flex flex-col w-1/2 gap-2">
                            <label className="text-gray-600 dark:text-gray-400">Edad</label>
                            <input type="date" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                        </div>
                        <div className="flex flex-col w-1/2 gap-2">
                            <label className="text-gray-600 dark:text-gray-400">Fecha de Nacimiento</label>
                            <input type="date" className="h-12 p-4 rounded-3xl  border-gray-300 bg-gray-50 focus:outline-none font-light placeholder-slate-300" />
                        </div>


                    </div>
                </form>
                <div className="flex justify-between gap-5">
                    <button onClick={cancelRegister} className="p-2 bg-gray-300 button mt-4">Continue later</button>
                    <button className="p-2 bg-crayola button mt-4" >Continue</button>
                </div>
            </div>
        </div>
    )
}

export default UserRegister;