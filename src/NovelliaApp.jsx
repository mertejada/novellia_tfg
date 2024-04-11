import React, { useState } from 'react';

import './App.css';


import appFirebase from './services/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(appFirebase); // Inicializamos el módulo de autenticación de Firebase
import Login from './components/Login';
import Admin from './components/Admin';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

import Home from './components/Home';


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
        
        <div>
            <NavBar isLoggedIn={user ? true : null} isAdmin={isAdmin} />
            {user ? (isAdmin ? <Admin /> : <Home userMail={user.email} />) : <Login />}
            <Footer />
        </div>

    );
}

export default App;
