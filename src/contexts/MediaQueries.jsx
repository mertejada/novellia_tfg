//voy a crear un contexto que maneje media queries
import React, { createContext, useContext, useEffect, useState } from 'react';

const MediaQueriesContext = createContext();

export const useMediaQueries = () => useContext(MediaQueriesContext);

export const MediaQueriesProvider = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
                setIsTablet(false);
                setIsDesktop(false);
            } else if (window.innerWidth < 1024) {
                setIsMobile(false);
                setIsTablet(true);
                setIsDesktop(false);
            } else {
                setIsMobile(false);
                setIsTablet(false);
                setIsDesktop(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    //handle beginning state
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsMobile(true);
            setIsTablet(false);
            setIsDesktop(false);
        } else if (window.innerWidth < 1024) {
            setIsMobile(false);
            setIsTablet(true);
            setIsDesktop(false);
        } else {
            setIsMobile(false);
            setIsTablet(false);
            setIsDesktop(true);
        }
    }, []);

    const value = { isMobile, isTablet, isDesktop };

    return <MediaQueriesContext.Provider value={value}>{children}</MediaQueriesContext.Provider>;
}