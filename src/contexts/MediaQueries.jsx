//voy a crear un contexto que maneje media queries
import React, { createContext, useContext, useEffect, useState } from 'react';

const MediaQueriesContext = createContext();

export const useMediaQueries = () => useContext(MediaQueriesContext);

/**
 * 
 * @param {*} children
 * @returns Media queries context provider
 */
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
            } else if (window.innerWidth <= 1024) {
                setIsTablet(true);
                setIsMobile(false);
                setIsDesktop(false);
                
            } else {
                setIsDesktop(true);
                setIsMobile(false);
                setIsTablet(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsMobile(true);
            setIsTablet(false);
            setIsDesktop(false);
        } else if (window.innerWidth <= 1024) {
            setIsTablet(true);
            setIsMobile(false);
            setIsDesktop(false);
        } else {
            setIsDesktop(true);
            setIsMobile(false);
            setIsTablet(false);
        }
    }, []);

    const value = { isMobile, isTablet, isDesktop };

    return <MediaQueriesContext.Provider value={value}>{children}</MediaQueriesContext.Provider>;
}