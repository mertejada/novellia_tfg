import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import ProfileSettings from './pages/ProfileSettings';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Bookshelf from './pages/Bookshelf';
import { AuthContext } from './contexts/AuthContext';

import './App.css';

function App() {
    const { user, isAdmin } = useContext(AuthContext);

    return (
        <Router>
            <NavBar />
            <Routes>
                {user && isAdmin &&
                <>
                    <Route path="/" element={<Admin />} />
                    <Route path="/admin" element={<Admin />} />
                    </>
                }

                {user ?
                    <>
                        <Route path="/*" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/profile" element={<ProfileSettings />} />
                        
                        <Route path="/bookshelf" element={<Bookshelf />} />
                        <Route path="/tracker" element={<Bookshelf />} />
                        <Route path="/discover" element={<Bookshelf />} />
                        
                    </>
                    :
                    <>
                        <Route path="/" element={<Login />} />
                        <Route path="/admin" element={<Login />} />
                    </>
                }

                

                
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
