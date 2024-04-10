import React, { useState } from 'react';

import './App.css';


import appFirebase from './services/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(appFirebase); // Inicializamos el módulo de autenticación de Firebase

import Home from './components/Home';
import Login from './components/Login';
import Footer from './components/Footer';
import NavBar from './components/NavBar';

function App() {
    //useState sirve para inicializar el estado de la aplicación
    const [user, setUser] = useState(null); // Inicializamos el estado user con null

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user); // Si el usuario está autenticado, lo guardamos en el estado user
        } else {
            setUser(null); // Si el usuario no está autenticado, guardamos null en el estado user
        }
    });

    return (
        
        <div>
            <NavBar isLoggedIn={user ? true : null}/>
            {user ? <Home userMail = {user.email} /> : <Login />}
            <Footer />
        </div>
    );
}

export default App;
