import React from 'react';
import { useState } from 'react';
//importar una imagen para usarla como fondo con tailwindcss
import bkImg from '../assets/img/test.jpg';

import appFirebase from '../services/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(appFirebase);


const Login = () => {
    const [register, setRegister] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showErrorMsg, setShowErrorMsg] = useState(null);

    const authentication = async (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            if (register) {
                await createUserWithEmailAndPassword(auth, email, password);


            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }

            setShowError(false);
        } catch (error) {
            setShowError(true);
            let errorMessage = "";
            console.log(error.code);
            switch (error.code) {
                case "auth/invalid-credential":
                    errorMessage = "Wrong email or password. Please try again.";
                    break;
                case "auth/weak-password":
                    errorMessage = "Weak password. Please try again.";
                    break;
                case "auth/email-already-in-use":
                    errorMessage = "Email is already in use. Try another one or log in."
                    break;
                default:
                    errorMessage = "An error occurred while attempting to authenticate. Please try again.";
                    break;
            }

            setShowErrorMsg(errorMessage);
        }

    }


    return (
        <section style={{ backgroundImage: `url(${bkImg})` }} className='p-20 bg-cover font-poppins font-light h-fit flex justify-center items-center lg:justify-start'>
    <div className="flex flex-col items-center justify-center lg:items-start">
        <h1 className="text-4xl text-center mb-4 ">Start your</h1>
        <h2 className="text-6xl font-extrabold font-playfair text-center mb-12">literature adventure</h2>

        <div className="bg-white shadow-gray-500 drop-shadow-md shadow-md rounded-3xl p-10 max-w-md w-full">
            <form className='flex flex-col gap-4' onSubmit={authentication}>
                <input id="email" type="email" placeholder="Your mail" className="h-12 p-4 rounded-xl bg-gray-100 text-gray-900 focus:outline-none" />
                <input id="password" type="password" placeholder="Password" className="h-12 p-4 rounded-xl bg-gray-100 text-gray-900 focus:outline-none" />
                {showError && <p className="text-red-600 bg-red-50 rounded-md text-center">{showErrorMsg}</p>}
                <button type="submit" className="h-12 p-2 button gradient rounded-3xl">{register ? "Sign up" : "Log in"}</button>
            </form>
            <h3 className="text-gray text-center cursor-default mt-4">{register ? "Already have an account? " : "Don't have an account? "}
            <button className="text-blue-500" onClick={() => { setRegister(!register); setShowError(""); }}>{register ? "Log in here." : "Sign up here."}</button>
            </h3>
        </div>
    </div>
</section>


    );
}

export default Login;
