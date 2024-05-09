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

    const { user, isAdmin, logout } = useAuth();
    const { isMobile } = useMediaQueries();

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
        { name: "Home", path: "/" },
        { name: "Discover", path: "/discover" },
        { name: "Bookshelf", path: "/bookshelf" }
    ];

    const adminLinks = [
        { name: "Admin", path: "/admin" },
    ];

    const renderLinks = (links) => {
        return isMobile ? (
            <>
                <MenuIcon onClick={toggleLinksMenu} className="cursor-pointer ml-auto" />
                {isLinksMenuOpen && (
                    <div className="absolute top-0 right-0 left-0 z-10 text-center bg-white border border-gray-200 rounded p-5" ref={linksMenuRef}>
                        <MenuIcon onClick={toggleLinksMenu} className="cursor-pointer ml-auto" />
                        
                        <ul className="py-2 px-4 text-center m-2">

                            {links.map((link) => (
                                <li key={link.name} className="hover:bg-gray-100 cursor-pointer rounded" onClick={() => setIsLinksMenuOpen(false)}>
                                    <Link to={link.path} className="block p-2">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                        <img src={img} alt="Logo" className="my-4 h-4 mx-auto" />
                        
                    </div>
                )}
            </>
        ) : (
            links.map((link) => (
                <Link key={link.name} to={link.path} className="mx-8">
                    {link.name}
                </Link>
            ))
        );
    };

    const renderAdminNav = () => (
        <div className="flex items-center gap-2  text-gray-800 cursor-pointer">
            {renderLinks(adminLinks)}
            <span onClick={handleLogout}>Log out</span>
            <LogoutIcon />
        </div>
    );

    const renderUserNav = () => (
        <div className="flex items-center text-gray-800 cursor-pointer">
            <div className="flex gap-5 mr-10">


            {renderLinks(userLinks)}</div>
            <div ref={profileMenuRef} className="relative">
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
                    <div className="absolute top-full right-0 bg-white rounded shadow w-40">
                        
                        <ul className="m-6 flex gap-2 flex-col">
                            <li className="hover:bg-gray-100 cursor-pointer" onClick={toggleUserMenu}>
                                <SettingsIcon className="mr-2" />
                                <Link to="/profile">Settings</Link>
                            </li>
                            <li className="hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                                <LogoutIcon className="mr-2" />
                                Log out
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <nav className="bg-white sticky top-0 border-b border-gray-200 z-20">
            <div className="shadow-lg flex justify-between items-center p-4 md:p-6 font-semibold">
                <Link to="/" className="flex items-center space-x-2">
                    <img src={img} alt="Logo" className="h-8" />
                </Link>
                {user ? (isAdmin ? renderAdminNav() : renderUserNav()) : null}
            </div>
        </nav>
    );
};

export default NavBar;
