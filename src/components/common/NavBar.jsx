import React, { useState, useEffect, useRef } from "react";
import logoImg from '../../assets/img/logo.png';

import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { useMediaQueries } from '../../contexts/MediaQueries';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { set } from "firebase/database";

const NavBar = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLinksMenuOpen, setIsLinksMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const linksMenuRef = useRef(null);

    const  img = logoImg;

    const navigate = useNavigate();

    const { user, isAdmin, logout } = useAuth(); // Utiliza el contexto de autenticación
    const { isMobile } = useMediaQueries(); // Utiliza el contexto de media queries


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }

            if (linksMenuRef.current && !linksMenuRef.current.contains(event.target)) {
                setIsLinksMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const toggleLinksMenu = () => {
        setIsLinksMenuOpen(!isLinksMenuOpen);
    };


    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const userLinks = [
        { name: "Home", path: "/home" },
        { name: "Library", path: "/bookshelf" },
        { name: "Tracker", path: "/tracker" },
        { name: "Discover", path: "/discover" },
    ];

    const adminLinks = [
        { name: "Admin", path: "/admin" },
    ];

    const renderLinks = (links) => {
        return isMobile ? (
            <>
                <MenuIcon onClick={toggleLinksMenu} className="cursor-pointer absolute top-15 right-20" />
                {isLinksMenuOpen && (
                    <div className="absolute top-16 right-20 w-40 bg-white border border-gray-200 rounded shadow-md" ref={linksMenuRef}>
                        <ul className="py-2 p-4 text-right">
                            {links.map((link) => (
                                <li key={link.name} className="px-4 py-2 hover:bg-gray-100  cursor-pointer rounded" onClick={() => setIsLinksMenuOpen(false)}>
                                    <Link to={link.path} >{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </>
        ) : (
            links.map((link) => (
                <Link key={link.name} to={link.path}>
                    {link.name}
                </Link>
            ))
        );
    };
    

    const renderAdminNav = () => (
        <div className="flex items-center gap-10 text-gray-800 cursor-pointer">
            {renderLinks(userLinks)}
            <span onClick={handleLogout}>Log out</span>
            <LogoutIcon />
        </div>
    );


    const renderUserNav = () => (
        <>
            <div className="flex items-center gap-10 text-gray-800 cursor-pointer font-semibold">
                {renderLinks(userLinks)}
            </div>
            <div ref={profileMenuRef}>
                {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        className="h-8 w-8 rounded-full cursor-pointer"
                        alt="User"
                        onClick={toggleUserMenu}
                    />
                ) : (
                    <AccountCircleIcon className="cursor-pointer" onClick={toggleUserMenu} />
                )}
                {isUserMenuOpen && (
                    <div className="absolute top-15 right-10 w-40 bg-white border border-gray-200 rounded shadow-md">
                        <ul className="py-2">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={toggleUserMenu}>
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
            </div></>
    );



    return (
        <nav className="bg-white sticky top-0 border-b border-gray-200 z-20">
            <div className="shadow-lg flex justify-between items-center p-6 pl-8 pr-8">
                <a href="/" className="flex items-center space-x-2">
                    <img src= {img} alt="Logo" className="h-8" />
                </a>
                {user ? (isAdmin ? renderAdminNav() : renderUserNav()) : null}
            </div>
        </nav>
    );
};

export default NavBar;
