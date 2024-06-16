import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { useAuth } from '../contexts/AuthContext';
import { useMediaQueries } from '../contexts/MediaQueries';
import { db } from '../services/firebase';

import About from '../components/about/About';
import Alert from '@mui/material/Alert';

import desktopImg from '../assets/img/login/login-2000.webp';
import tabletImg from '../assets/img/login/login-1700.webp';
import mobileImg from '../assets/img/login/login-1000.webp';



/**
 * 
 * @returns Login page 
 */
const Login = () => {
    const [register, setRegister] = useState(false);
    const [message, setMessage] = useState({ type: null, content: null });

    const { isTablet, isDesktop } = useMediaQueries();
    const { auth } = useAuth(); 
    const navigate = useNavigate();

    const background = isDesktop ? desktopImg : isTablet ? tabletImg : mobileImg;

    // User document template
    const userTemplate = (email) => {
        let userData = {
            email: email,
            userInfo: false,
            lists: {
                currentlyReading: [],
                wishList: [],
                favourites: [],
                finishedBooks: []
            },
            readingGoals: {
                dailyReading: 30,
                booksPerYear: 10,
                diffGenres: 3,
            },
            readingSessions: [],
            finishedBooksInfo: {}
        }

        return userData;
    }


    /**
     * Authentication function
     * @param {Event} event
     * @returns Authentication function
     */
    const authentication = async (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        if (register && event.target.password_repeat.value !== password) {
            setPasswordMatchError(true); // if both password inputs don't match
            setMessage({ type: "error", content: "Passwords do not match." });
            return;
        }

        try {
            if (register) { 
                // Create user and set user document
                await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "users", auth.currentUser.uid), userTemplate(email));
            
            } else {
                // Sign in 
                await signInWithEmailAndPassword(auth, email, password);
            }

            setMessage({ type: "success", content: "Authentication successful." });
        } catch (error) {
            setMessage({ type: "error", content: errorType(error.code) });
        }
    };

    /**
     * 
     * @returns Sign in with Google
     */
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            setMessage({ type: "success", content: "Authentication successful." });

            const email = result.user.email;

            const userDocRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(userDocRef);

            // Create user document if it doesn't exist
            if (!docSnap.exists()) {
                await setDoc(userDocRef, userTemplate(email));
                navigate("/");
                return;
            }
            navigate("/");
            
        } catch (error) {
            setMessage({ type: "error", content: errorType(error.code) });
        }
    };

    /**
     * Message for error handling
     * @param {*} errorCode 
     * @returns Error message
     */
    const errorType = (errorCode) => {
        let errorMessage = "";
        switch (errorCode) {
            case "auth/invalid-credential":
                errorMessage = "Wrong email or password. Please try again.";
                break;
            case "auth/weak-password":
                errorMessage = "Password must be at least 6 characters long and contain 3 numbers.";
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
        <>
            <section style={{ backgroundImage: `url(${background})`}} className='p-20 bg-cover font-poppins font-light h-fit flex justify-center items-center lg:justify-start bg-gray-100 shadow-inner'>
                <div className="flex flex-col items-center justify-center lg:justify-start lg:items-start ">
                    <h1 className="text-4xl text-center mb-4 ">Start your</h1>
                    <h2 className="text-6xl font-extrabold font-playfair text-center mb-12 text-gradient gradient">literature adventure<span className='text-black'>.</span></h2>

                    <div className="bg-white shadow-gray-500 drop-shadow-md shadow-md rounded-3xl p-10 w-full sm:w-3/4 ">
                        <form className='flex flex-col gap-4' onSubmit={authentication}>
                            <input id="email" type="email" placeholder="Your mail" className="h-12 p-4 rounded-xl bg-gray-100 text-gray-900 focus:outline-none border-gray-300" />
                            <input id="password" type="password" placeholder="Password" className="h-12 p-4 rounded-xl bg-gray-100 text-gray-900 focus:outline-none border-gray-300" />
                            {register && (
                                <>
                                    <input id="password_repeat" type="password" placeholder="Repeat Password" className="h-12 p-4 rounded-xl bg-gray-100 text-gray-900 focus:outline-none border-gray-300" />
                                    
                                </>
                            )}
                            
                            {message.type && (
                                <Alert severity={message.type} onClose={() => setMessage({ type: null, content: null })}>
                                    {message.content}
                                </Alert>
                            )}

                            <button type="submit" className="h-12 p-2 text-white button bg-zinc-700 rounded-3xl">{register ? "Sign up" : "Log in"}</button>
                            <button type="button" onClick={signInWithGoogle} className="flex button items-center justify-center h-12 p-2 bg-white rounded-xl shadow-md border border-gray-300 hover:bg-gray-100 focus:outline-none">
                                <img className="h-6 w-6 mr-2" src="https://rotulosmatesanz.com/wp-content/uploads/2017/09/2000px-Google_G_Logo.svg_.png" alt="Google Logo" />
                                <span className="font-medium text-gray-800">Continue with Google</span>
                            </button>
                        </form>
                        <h3 className="text-gray text-center cursor-default mt-4">{register ? "Already have an account? " : "Don't have an account? "}
                            <button className="text-blue-500" onClick={() => { setRegister(!register); setPasswordMatchError(false); }}>{register ? "Log in here." : "Sign up here."}</button> {/** Change to login or register */}
                        </h3>
                    </div>
                </div>
            </section>
            <About />

        </>
    );
}

export default Login;
