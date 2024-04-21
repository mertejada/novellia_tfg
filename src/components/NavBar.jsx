import React, { useState, useEffect, useRef } from "react";
import logoImg from '../assets/img/logo.png';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Importa el hook useAuth

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const { user, isAdmin, logout} = useAuth(); // Utiliza el contexto de autenticación

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => { 
        logout();
        navigate("/");
    };

    const renderAdminNav = () => (
        <div className="flex items-center gap-2 text-gray-500 cursor-pointer">
            <span onClick={handleLogout}>Log out</span>
            <LogoutIcon />
        </div>
    );

    const renderUserNav = () => (
        <div className="relative" ref={menuRef}>
            {user.photoURL ? (
                <img
                    src={user.photoURL}
                    className="h-8 w-8 rounded-full cursor-pointer"
                    alt="User"
                    onClick={toggleMenu}
                />
            ) : (
                <AccountCircleIcon className="cursor-pointer" onClick={toggleMenu} />
            )}
            {isMenuOpen && (
                <div className="absolute top-10 right-0 w-40 bg-white border border-gray-200 rounded shadow-md">
                    <ul className="py-2">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={toggleMenu}>
                            <SettingsIcon className="mr-2" />
                            <Link to="/profile">Settings</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                            <LogoutIcon className="mr-2" />
                            Log out
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );

    return (
        <nav className="bg-white sticky top-0 border-b border-gray-200 z-10">
            <div className="shadow-lg flex justify-between items-center p-6 pl-8 pr-8">
                <a href="#" className="flex items-center space-x-2">
                    <img src={logoImg} className="h-8" alt="Novellia Logo" />
                </a>
                {user ? (isAdmin ? renderAdminNav() : renderUserNav()) : null}
            </div>
        </nav>
    );
};

export default NavBar;
