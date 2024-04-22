import React from "react";


const Intro = () => {
    return (
        <div className="content-element flex flex-col items-center gap-7">
            <div className="flex flex-col items-center gap-5">

            <h1 className="subtitle  text-center text-gray-300">We help you bring your <br/>
            <span className="title text-gradient gradient text-4xl md:text-6xl"> readings  to life</span></h1>
            </div>
            <p className="w-full font-light md:w-1/2 text-center ">
            Organize your readings, achieve new literary goals 
            and discover new books. Explore new worlds through pages and 
            <span className="font-bold"> enjoy your literary adventure.</span>
            </p>
        </div>
    ) 
}

export default Intro;