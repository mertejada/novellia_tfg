import React from "react";
import Lists from "../components/bookshelf/Lists";
import Progress from "../components/bookshelf/Progress";
import progress from "../assets/img/bookshelf/work-in-progress (1).png";
import bookshelf from "../assets/img/bookshelf/bookshelf.png";

/**
 * 
 * @returns Bookshelf page
 */
const Bookshelf = () => {
    // Scroll to element
    const handleGoTo = (elementId) => {
        const element = document.getElementById(elementId);
        element.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <main className="md:content">
            <section className="content-element flex flex-col justify-between items-center">
                <div className="w-1/2 text-center ">
                    <h1 className="title font-bold font-playfair">Bookshelf</h1>
                    <p className="subtitle mt-3 text-gradient gradient">You are such an adventurous reader!</p>
                </div>
                
                <article className="grid grid-cols-1 sm:grid-cols-2 justify-between sm:gap-3">
                    <div
                        className="bg-white border rounded-2xl p-5 mt-7 flex items-center h-fit w-52 gap-4 transform transition-transform hover:scale-105 cursor-pointer"
                        onClick={() => handleGoTo('lists')}
                    >
                        <img src={bookshelf} alt="bookshelf" className="w-10" width={50} height={50} />
                        <p>See your collections</p>
                    </div>

                    <div
                        className="bg-white border rounded-2xl p-5 mt-7 flex items-center h-fit w-52 gap-4 transform transition-transform hover:scale-105 cursor-pointer"
                        onClick={() => handleGoTo('progress')}
                    >
                        <img src={progress} alt="progress" className="w-10" width={50} height={50} />
                        <p>See your progress</p>
                    </div>
                </article>
            </section>

            <hr className="w-1/2 mx-auto my-20" />

            <section id="lists">
                <Lists />
            </section>

            <section id="progress">
                <Progress />
            </section>
        </main>
    );
};

export default Bookshelf;
