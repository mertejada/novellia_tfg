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
            <form className="bg-white rounded-2xl shadow-lg p-8 w-96">
                <input type="text" placeholder="Name" className="w-full h-12 p-4 rounded-xl bg-gray-100 text-gray-900 focus:outline-none mb-4" />
                <input type="text" placeholder="Last Name" className="w-full h-12 p-4 rounded-xl bg-gray-100 text-gray-900 focus:outline-none mb-4" />
                <input type="number" placeholder="Age" className="w-full h-12 p-4 rounded-xl bg-gray-100 text-gray-900 focus:outline-none mb-4" />
                </form>
            <button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold py-2 px-4 rounded-xl">Register</button>
            <button className="bg-gradient-to-r from-red-500 to-red-400 text-white font-bold py-2 px-4 rounded-xl" onClick={() => cancelRegister()}>Cancel</button>
        </div>
    )
}

export default UserRegister;