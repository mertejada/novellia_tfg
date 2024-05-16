import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';
import SessionButton from "./components/common/SessionButton";
import SessionTimer from "./components/common/SessionTimer";
import Home from './pages/Home';
import ProfileSettings from './pages/ProfileSettings';
import Login from './pages/Login';
import Bookshelf from './pages/Bookshelf';
import List from './pages/List';
import Tracker from './pages/Tracker';
import Discover from './pages/Discover';
import Book from './pages/Book';
import AdminBooks from './pages/AdminBooks';
import AdminBook from './pages/AdminBook';
import AdminGenres from './pages/AdminGenres';


import { AuthContext } from './contexts/AuthContext';

import './App.css';

function App() {
    const { user, isAdmin } = useContext(AuthContext);
    const [showSessionTimer, setShowSessionTimer] = useState(false);

    //cuando esta el SessionTimer activo, se desactiva el scroll y el click

    useEffect(() => {
        if (showSessionTimer) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
        , [showSessionTimer]);



    return (
        <Router>
            <NavBar setShowSessionTimer={setShowSessionTimer} />
            <Routes>
                {user ? (
                    isAdmin ? (
                        <>
                            <Route path="/" element={<AdminBooks />} />
                            <Route path="/admin" element={<AdminBooks />} />
                            <Route path="/admin/books/*" element={<AdminBook />} />
                            <Route path="/admin/genres" element={<AdminGenres />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/profile" element={<ProfileSettings />} />
                            <Route path="/bookshelf" element={<Bookshelf />} />
                            <Route path="/bookshelf/*" element={<List />} />
                            <Route path="/tracker" element={<Tracker />} />
                            <Route path="/discover" element={<Discover />} />
                            <Route path="/book/*" element={<Book setShowSessionTimer={setShowSessionTimer} />} />

                        </>


                    )
                ) : (
                    <Route path="/" element={<Login />} />
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
