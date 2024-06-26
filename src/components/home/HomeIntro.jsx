import React from "react";
import { useState, useEffect } from "react";
import videoBg from "../../assets/videos/video.mp4";
import videoBgTablet from "../../assets/videos/video-tablet.mp4";
import videoBgMobile from "../../assets/videos/video-mobile.mp4";
import { useMediaQueries } from '../../contexts/MediaQueries';
import { Link } from "react-router-dom";

import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

/**
 * 
 * @returns Home Intro component
 */
const HomeIntro = () => {
    const { isTablet, isMobile } = useMediaQueries();
    const height = isMobile ? 500 : isTablet ? 600 : 800;
    const width = isMobile ? 300 : isTablet ? 400 : 600;
    const videoSrc = isMobile ? videoBgMobile : isTablet ? videoBgTablet : videoBg;

    /**
     * Scroll to the about section
     */
    const leadToAbout = () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    /**
     * Scroll to the new books section
     */
    const leadToNewBooks = () => {
        const newBooksSection = document.getElementById('new-books');
        if (newBooksSection) {
            newBooksSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="bg-black relative">
            <video src={videoSrc} autoPlay loop muted className="w-full h-full object-cover opacity-20" width={width} height={height}></video>

            {!isMobile && (
                <div className="absolute top-0 right-0 m-10 z-10 text-white text-right flex gap-5 cursor-pointer opacity ">
                    <div className=" text-white cursor-pointer opacity" onClick={leadToNewBooks}>
                        New
                    </div>
                    <div className="text-white cursor-pointer opacity" onClick={leadToAbout}>
                        About
                    </div>
                </div>
            )}

            <article className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-4 gap-4 text-center">
                {isMobile && (
                    <ul className="flex items-center gap-4 justify-center ">
                        <li className="text-white  cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300 ease-in-out" onClick={leadToNewBooks}>New

                        </li>
                        <li className="text-white cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300 ease-in-out" onClick={leadToAbout}>About
                        </li>

                    </ul>
                )}

                <div className="flex flex-col items-center">
                    <h1 className="title text-white ">Welcome to Novellia</h1>
                    <p className="w-2/3 subtitle text-white gradient text-gradient">
                        We're happy to see you here! Continue with your reading journey.</p>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 ">
                    <Link className="cursor-pointer button border-white border text-white scale duration-400"
                        to="/discover" name="discover"
                    >
                        Discover
                    </Link>
                    <Link className="cursor-pointer flex items-center button bg-white text-black scale duration-400"
                        to="/bookshelf" name="bookshelf"
                    >
                        <LocalLibraryIcon className="text-black mr-2" />
                        Your bookshelf
                    </Link>
                </div>
            </article>
        </section>
    );
}

export default HomeIntro;
