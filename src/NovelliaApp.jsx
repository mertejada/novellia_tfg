import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';
import SessionButton from "./components/common/SessionButton";
import SessionTimer from "./components/common/SessionTimer";
import Home from './pages/Home';
import GoalsSettings from './pages/GoalsSettings';
import Login from './pages/Login';
import Bookshelf from './pages/Bookshelf';
import List from './pages/List';
import Discover from './pages/Discover';
import Book from './pages/Book';
import AdminBooks from './pages/AdminBooks';
import AdminBook from './pages/AdminBook';
import AdminGenres from './pages/AdminGenres';
import ScrollToTop from "./components/common/ScrollToTop";

import { AuthContext } from './contexts/AuthContext';

import loadingGif from './assets/loadingAnimation.gif';

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import './App.css';

function App() {
    const { user, isAdmin, loading } = useContext(AuthContext);
    const [showSessionTimer, setShowSessionTimer] = useState(false);
    const [minLoading, setMinLoading] = useState(true);

    

    useEffect(() => {
        if (showSessionTimer) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showSessionTimer]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinLoading(false);
        }, 2000); 

        return () => clearTimeout(timer);
    }, []);

    if (loading || minLoading) {
        return (
            <div className="bg-white flex flex-col gap-5 justify-center items-center h-screen w-screen" >
                <img src={loadingGif
                } alt="Loading" className="w-32" width={50} color="inherit" />
                <Stack sx={{ color: 'black' }} >
                <CircularProgress size={30} color="inherit" />
                </Stack>
            </div>
        );
    }

    return (
        <Router>
            <NavBar setShowSessionTimer={setShowSessionTimer} />
            <ScrollToTop />
            <Routes>
                {user ? (
                    isAdmin ? (
                        <>
                            <Route path="/" element={<AdminBooks />} />
                            <Route path="/admin/books" element={<AdminBooks />} />
                            <Route path="/admin/book/*" element={<AdminBook />} />
                            <Route path="/admin/genres" element={<AdminGenres />} />
                            <Route path="*" element={<Navigate to="/" />} />

                        </>
                    ) : (
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/goals" element={<GoalsSettings />} />
                            <Route path="/bookshelf" element={<Bookshelf />} />
                            <Route path="/bookshelf/*" element={<List />} />
                            <Route path="/discover" element={<Discover />} />
                            <Route path="/book/*" element={<Book setShowSessionTimer={setShowSessionTimer} />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    )
                ) : (
                    <>
                    <Route path="/" element={<Login />} />
                    <Route path="*" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
            <Footer />

            {(user && !isAdmin) && (
                <>
                    <SessionButton setShowSessionTimer={setShowSessionTimer} />
                    {showSessionTimer && <SessionTimer setShowSessionTimer={setShowSessionTimer} />}
                </>
            )}
        </Router>
    );
}

export default App;
