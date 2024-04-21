import React, { useState } from 'react';
import bkImg from '../assets/img/test.jpg';
import appFirebase from '../services/firebase';

import { useNavigate } from 'react-router-dom';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';



const Login = () => {
    const [register, setRegister] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showErrorMsg, setShowErrorMsg] = useState(null);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const { user, isAdmin, auth } = useAuth(); // Destructure user and isAdmin from context
    const navigate = useNavigate();
    

    const userTemplate = (email) =>{
        let userData =  {
            email: email,
            userInfo: false,
            lists: {
                readingList: [],
                wishList: [],
                favourites: [],
                finished: []
            },
            readingSessions: []
        }

        return userData;
    }
    

    const authentication = async (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        if (register && event.target.password_repeat.value !== password) {
            setPasswordMatchError(true);
            setShowError(false);
            return;
        }

        try {
            if (register) {
                await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "users", auth.currentUser.uid), userTemplate(email));
                navigate("/home");

            } else {
                await signInWithEmailAndPassword(auth, email, password);

                if (isAdmin) {
                    navigate("/admin");
                    return;
                }

                navigate("/home");
            }

            setShowError(false);
        } catch (error) {
            setShowError(true);
            setPasswordMatchError(false);
            
            setShowErrorMsg(errorType(error.code));
        }
    };

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            setShowError(false);

            const email = result.user.email; 

            const userDocRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
                await setDoc(userDocRef, userTemplate(email));
            }

            navigate("/home");
        } catch (error) {
            setShowError(true);
            setShowErrorMsg("An error occurred while attempting to sign in with Google. Please try again.");
        }
    };

    const errorType = (errorCode) => {
        let errorMessage = "";
        switch (errorCode) {
            case "auth/invalid-credential":
                errorMessage = "Wrong email or password. Please try again.";
                break;
            case "auth/weak-password":
                errorMessage = "Weak password. Please try again.";
                break;
            case "auth/email-already-in-use":
                errorMessage = "Email is already in use. Try another one or log in.";
                break;
            default:
                errorMessage = "An error occurred while attempting to authenticate. Please try again.";
                break;
        }

        return errorMessage;
    }




    return (
        <section style={{ backgroundImage: `url(${bkImg})` }} className='p-20 bg-cover font-poppins font-light h-fit flex justify-center items-center lg:justify-start'>
            <div className="flex flex-col items-center justify-center lg:items-start">
                <h1 className="text-4xl text-center mb-4 ">Start your</h1>
                <h2 className="text-6xl font-extrabold font-playfair text-center mb-12 text-gradient gradient">literature adventure<span className='text-black'>.</span></h2>

                <div className="bg-white shadow-gray-500 drop-shadow-md shadow-md rounded-3xl p-10 max-w-md w-full">
                    <form className='flex flex-col gap-4' onSubmit={authentication}>
                        <input id="email" type="email" placeholder="Your mail" className="h-12 p-4 rounded-xl bg-gray-100 text-gray-900 focus:outline-none border-gray-300" />
                        <input id="password" type="password" placeholder="Password" className="h-12 p-4 rounded-xl bg-gray-100 text-gray-900 focus:outline-none border-gray-300" />
                        {register && (
                            <>
                                <input id="password_repeat" type="password" placeholder="Repeat Password" className="h-12 p-4 rounded-xl bg-gray-100 text-gray-900 focus:outline-none border-gray-300" />
                                {passwordMatchError && (

                                    <p className="text-red-600 bg-red-50 rounded-md gap-4 flex items-center justify-center p-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-6 ml-2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                        </svg>
                                        Passwords do not match.
                                    </p>
                                )}
                            </>
                        )}
                        {showError && (
                            <p className="text-red-600 bg-red-50 rounded-md gap-4 flex items-center justify-center p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-6 ml-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                                {showErrorMsg}
                            </p>
                        )}

                        <button type="submit" className="h-12 p-2 button bg-zinc-700 rounded-3xl">{register ? "Sign up" : "Log in"}</button>
                        <button type="button" onClick={signInWithGoogle} className="flex button items-center justify-center h-12 p-2 bg-white rounded-xl shadow-md border border-gray-300 hover:bg-gray-100 focus:outline-none">
                            <img className="h-6 w-6 mr-2" src="https://rotulosmatesanz.com/wp-content/uploads/2017/09/2000px-Google_G_Logo.svg_.png" alt="Google Logo" />
                            <span className="font-medium text-gray-800">Continue with Google</span>
                        </button>
                    </form>
                    <h3 className="text-gray text-center cursor-default mt-4">{register ? "Already have an account? " : "Don't have an account? "}
                        <button className="text-blue-500" onClick={() => { setRegister(!register); setShowError(""); setPasswordMatchError(false); }}>{register ? "Log in here." : "Sign up here."}</button>
                    </h3>
                </div>
            </div>
        </section>
    );
}

export default Login;
