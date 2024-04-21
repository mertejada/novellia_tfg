// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import ProfileSettings from './components/ProfileSettings';
import Login from './components/Login';
import Admin from './components/Admin';

//css
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<ProfileSettings />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
