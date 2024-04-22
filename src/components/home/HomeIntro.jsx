import React from "react";
import videoBg from "../../assets/video.mp4";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const HomeIntro = () => {
    const leadToAbout = () => {
        const aboutSection = document.getElementById('about-move');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-black relative">
            <video src={videoBg} autoPlay loop muted className="w-full h-full object-cover opacity-40"></video>
            
            <div className="absolute top-0 right-0  m-10 z-10 text-white cursor-pointer opacity-60 hover:opacity-100 transition-opacity
            duration-300 ease-in-out"
                    onClick={leadToAbout}>
                        About
                    <KeyboardArrowDownIcon className=" text-white text-5xl m-1" fontSize="medium"/>
                    </div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold mb-4 font-playfair">Welcome to Novellia</h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white gradient text-gradient font-light">We're happy to see you here! Continue with your reading journey.</p>
                <div className="flex gap-4 mt-4">
                    <button className="border border-white  text-white p-2 px-4 rounded-lg">Get Started</button>
                    <button className="bg-white text-black p-2 px-4 rounded-lg">Learn More</button>
                    </div>
            </div>
        </div>
    );
}

export default HomeIntro;
