import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


import './App.css';


import appFirebase from './services/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(appFirebase); // Inicializamos el módulo de autenticación de Firebase
import Login from './components/Login';
import Admin from './components/Admin';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

import Home from './components/Home';
import ProfileSettings from './components/ProfileSettings';


function App() {
    const [user, setUser] = useState(null); // Inicializamos el estado user con null
    const [isAdmin, setIsAdmin] = useState(false); // Inicializamos el estado isAdmin con false

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user); // Si el usuario está autenticado, lo guardamos en el estado user
            user.email === "admin@novellia.com" ? setIsAdmin(true) : setIsAdmin(false); 
        } else {
            setUser(null); // Si el usuario no está autenticado, guardamos null en el estado user
        }
    });

    return (
        //routes
        <Router>
            <NavBar isLoggedIn={user ? true : null} isAdmin={isAdmin} />
            <Routes>
            <Route
                path="/"
                element={
                    user ? (
                        isAdmin ? <Navigate to="/home" /> : <Navigate to="/admin" />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route path="/home" element={<Home userMail={user?.email} />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/login" element={<Login isAdmin={isAdmin}/>} />

            {isAdmin && 
                <Route path="/admin" element={<Admin />} />}
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
