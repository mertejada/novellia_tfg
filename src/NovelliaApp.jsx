// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';

import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import ProfileSettings from './pages/ProfileSettings';
import Login from './pages/Login';
import Admin from './pages/Admin';

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
