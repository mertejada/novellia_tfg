import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import ProfileSettings from './pages/ProfileSettings';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Bookshelf from './pages/Bookshelf';
import List from './pages/List';
import Tracker from './pages/Tracker';
import Discover from './pages/Discover';
import Book from './pages/Book';

import { AuthContext } from './contexts/AuthContext';

import './App.css';

function App() {
    const { user, isAdmin } = useContext(AuthContext);

    return (
        <Router>
            <NavBar />
            <Routes>
                {isAdmin &&
                <>
                    <Route path="/" element={<Admin />} />
                    <Route path="/admin" element={<Admin />} />
                    </>
                }

                {user ?
                    <>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/profile" element={<ProfileSettings />} />
                        
                        <Route path="/bookshelf" element={<Bookshelf />} />
                        <Route path="/bookshelf/*" element={<List />} />

                        <Route path="/tracker" element={<Tracker />} />
                        <Route path="/discover" element={<Discover />} />
                        <Route path="/book/*" element={<Book />} />
                        

                        
                        
                    </>
                    :
                    <>
                        <Route path="/" element={<Login />} />
                    </>
                }

                

                
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
