import React from "react";

import Intro from './Intro';
import InfoCard from './InfoCard';

const About = () => {
    return (
        <div className="content" >
                <Intro className="mt-10" />
                <div className="content-element mx-12 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8">
                    <InfoCard
                        color="#EE902D"
                        title="Bookshelf"
                        text="Organize your readings and create new personal lists."
                        icon={0} />
                    <InfoCard
                        color="#F36057"
                        title="Tracking"
                        text="Keep track of your progress and reach your goals."
                        icon={1} />
                    <InfoCard
                        color="#1F7AC5"
                        title="Discover"
                        text="Explore and search for new books."
                        icon={2} />
                    <InfoCard
                        color="#EE902D"
                        title="Add books"
                        text="Add new books and share them all!"
                        icon={3} />
                </div>

            </div>
    ) 
}

export default About;