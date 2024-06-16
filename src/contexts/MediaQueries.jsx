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
    const [isBigScreen, setIsBigScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
                setIsTablet(false);
                setIsDesktop(false);
                setIsBigScreen(false);
            } else if (window.innerWidth <= 1024) {
                setIsTablet(true);
                setIsMobile(false);
                setIsDesktop(false);
                setIsBigScreen(false);
            } else if(window.innerWidth <= 2000){
                setIsDesktop(true);
                setIsBigScreen(false);
                setIsMobile(false);
                setIsTablet(false);
            }else{
                setIsDesktop(false);
                setIsBigScreen(true);
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
            setIsBigScreen(false);
        } else if (window.innerWidth <= 1024) {
            setIsTablet(true);
            setIsMobile(false);
            setIsDesktop(false);
            setIsBigScreen(false);
        } else if(window.innerWidth <= 2000){
            setIsDesktop(true);
            setIsBigScreen(false);
            setIsMobile(false);
            setIsTablet(false);
        }else{
            setIsDesktop(false);
            setIsBigScreen(true);
            setIsMobile(false);
            setIsTablet(false);
    
        }
    }, []);

    const value = { isMobile, isTablet, isDesktop, isBigScreen };

    return <MediaQueriesContext.Provider value={value}>{children}</MediaQueriesContext.Provider>;
}