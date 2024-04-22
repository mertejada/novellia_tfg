import React from "react";

import Intro from './Intro';
import InfoCard from './InfoCard';

const About = () => {
    return (
        <div className='content ' >
                <Intro className="mt-10" />
                <div className="content-element flex flex-col sm:flex-row flex-wrap justify-center items-center gap-10">
                    <InfoCard
                        color="#EE902D"
                        title="Bookshelf"
                        text="Organize your readings and create new personal lists."
                        icon={0} />
                    <InfoCard
                        color="#F36057"
                        title="Tracking"
                        text="Keep track of your reading progress and reach your goals."
                        icon={1} />
                    <InfoCard
                        color="#1F7AC5"
                        title="Discover"
                        text="Explore the books and do searchs based on your interests."
                        icon={2} />
                    <InfoCard
                        color="#EE902D"
                        title="Add books"
                        text="You can't find a book? Add it yourself and share it with the world!"
                        icon={3} />
                </div>

            </div>
    ) 
}

export default About;