import React from "react";
import { useState, useEffect } from "react";
import videoBg from "../../assets/video.mp4";
import videoBgTablet from "../../assets/video-tablet.mp4";
import videoBgMobile from "../../assets/video-mobile.mp4";
import { useMediaQueries } from '../../contexts/MediaQueries';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';


const HomeIntro = () => {
    const { isTablet, isMobile } = useMediaQueries();
    const [videoSrc, setVideoSrc] = useState(videoBg);

    useEffect(() => {
        const video = isMobile ? videoBgMobile : isTablet ? videoBgTablet : videoBg;
        setVideoSrc(video);
    }, [isMobile, isTablet]);

    const leadToAbout = () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const leadToNewBooks = () => {
        const newBooksSection = document.getElementById('new-books');
        if (newBooksSection) {
            newBooksSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-black relative">
            <video src={videoSrc} autoPlay loop muted className="w-full h-full object-cover opacity-15"></video>

            {!isMobile && (
                <div className="absolute top-0 right-0 m-10 z-10 text-white text-right flex gap-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300 ease-in-out">

                    <div className="text-white cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300 ease-in-out" onClick={leadToAbout}>
                        About
                        <KeyboardArrowDownIcon className="text-white text-5xl m-1" fontSize="medium" />
                    </div>
                    <div className=" text-white cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300 ease-in-out" onClick={leadToNewBooks}>
                        New
                        <KeyboardArrowDownIcon className="text-white text-5xl m-1" fontSize="medium" />
                    </div>

                </div>
            )}

            <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-4 gap-4 text-center">
                {isMobile && (
                    <ul className="flex items-center gap-4 justify-center ">
                        <li className="text-white  cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300 ease-in-out" onClick={leadToNewBooks}>New
                            <KeyboardArrowDownIcon className="text-white text-5xl m-1" fontSize="medium" />

                        </li>
                        <li className="text-white cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300 ease-in-out" onClick={leadToAbout}>About
                            <KeyboardArrowDownIcon className="text-white text-5xl m-1" fontSize="medium" />
                        </li>

                    </ul>
                )}

                <div className="flex flex-col items-center transition-all duration-300 ease-in-out">
                    <h1 className="title text-white font-bold mb-4 font-playfair">Welcome to Novellia</h1>
                    <p className="w-2/3 subtitle text-white gradient text-gradient">
                        We're happy to see you here! Continue with your reading journey.</p>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 ">
                    <button className="cursor-pointer button border-white border text-white hover:transition-transform hover:transform hover:scale-110 duration-400 ease-in-out transition-transform duration-400">
                        Discover
                    </button>
                    <button className="cursor-pointer button bg-white text-black hover:transition-transform hover:transform hover:scale-110 duration-400 ease-in-out transition-transform duration-400">
                        <PlayCircleIcon className="text-black mr-2" />
                        Start session
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomeIntro;
