import React, { useState, useEffect, useRef } from "react";
import logoImg from '../../assets/img/logo.png';

import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { useMediaQueries } from '../../contexts/MediaQueries';

import { PersonRounded as PersonRoundedIcon, FlagRounded as FlagRoundedIcon, ExitToAppRounded as ExitToAppRoundedIcon, MenuRounded as MenuRoundedIcon, PlayCircleRounded as PlayCircleRoundedIcon, CancelRounded as CancelRoundedIcon } from '@mui/icons-material';

const NavBar = ({ setShowSessionTimer }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLinksMenuOpen, setIsLinksMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const linksMenuRef = useRef(null);

    const img = logoImg;

    const navigate = useNavigate();

    const { user, isAdmin, logout } = useAuth();
    const { isMobile, isDesktop } = useMediaQueries();

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
        { name: "Books", path: "/admin/books" },
        { name: "Genres", path: "/admin/genres" },
    ];

    const renderUserImg = () => {
        return user.photoURL ? (
            <img
                src={user.photoURL}
                className="h-8 w-8 rounded-full cursor-pointer "
                alt="User"
                onClick={toggleUserMenu}
            />

        ) : (
            <PersonRoundedIcon className=" cursor-pointer " onClick={toggleUserMenu} />
        );  
    };

    const renderLinks = (links) => {
        return isMobile ? (
            <>
                <MenuRoundedIcon onClick={toggleLinksMenu} className="cursor-pointer ml-auto" />
                {isLinksMenuOpen && (
                    <div className="absolute top-0 right-0 left-0 z-30 bg-white border border-gray-200 rounded p-5 text-center" ref={linksMenuRef}>
                        <MenuRoundedIcon onClick={toggleLinksMenu} className="cursor-pointer ml-auto" />

                        <ul className="py-2 px-4 text-center m-2">

                            {links.map((link) => (
                                <li key={link.name} className="hover:bg-gray-100  cursor-pointer rounded" onClick={() => setIsLinksMenuOpen(false)}>
                                    <Link to={link.path} className="block p-2">{link.name}</Link>
                                </li>
                            ))}
                            <img src={img} alt="Logo" className="my-4 h-4 mx-auto" />
                        </ul>
                    </div>
                )}
            </>
        ) : (
            <div className="cursor-pointer">
                {links.map((link) => (

                    <Link key={link.name} to={link.path} className="mx-5 font-normal text-gray-500 hover:text-black transition-all duration-75 ease-in-out">
                        {link.name}
                    </Link>

                ))}
                <span className="mx-2 font-normal text-gray-500">|</span>
            </div>
        );
    };

    const renderAdminNav = () => (
        <div className="flex items-center gap-2  text-gray-800 cursor-pointer">
            {renderLinks(adminLinks)}
            <span onClick={handleLogout}>Log out</span>
            <ExitToAppRoundedIcon />
        </div>
    );

    const renderUserNav = () => (
        <div className="flex gap-2 sm:gap-5 items-center text-gray-800 cursor-pointer">


            {renderLinks(userLinks)}



            <button className="flex gap-1 font-normal  px-2 py-1 items-center  transition-all duration-150 ease-in-out  hover:bg-black hover:text-white hover:border-black  rounded-full  border-black text-black" onClick={setShowSessionTimer}>
                <PlayCircleRoundedIcon /> {isDesktop && "Start session"}
            </button>
            
             {renderUserImg()}

                {isUserMenuOpen && (
                    <div className="absolute top-20 right-0 z-30 bg-white px-4 opacity-95 border  xs:opacity-100 rounded py-5 m-4 text-center w-full sm:w-fit" ref={profileMenuRef}>
                        <CancelRoundedIcon onClick={toggleUserMenu} className="cursor-pointer text-gray-300" />

                        <ul className="m-4 flex gap-2 flex-col">
                            <li className="hover:bg-gray-100 cursor-pointer" onClick={toggleUserMenu}>
                                <Link to="/goals"><FlagRoundedIcon className="mr-2 text-carrot" />Goals</Link>
                            </li>
                            <li className="hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                                <ExitToAppRoundedIcon className="mr-2 text-gray-200" />
                                Log out
                            </li>
                        </ul>
                    </div>
                )}
        </div>
    );

    return (
        <nav className="bg-white top-0 border-b border-gray-200 z-20">
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
