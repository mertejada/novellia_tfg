import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Importa ThemeProvider
import { PlayCircleRounded } from "@mui/icons-material";


/**
 *
 * @param {*} setShowSessionTimer
 * @return {*} 
 */
const SessionButton = ({setShowSessionTimer}) => {
    const [onHover, setOnHover] = useState(false);

    const theme = createTheme({
        palette: {
            mariner: {
                main: '#1F7AC5',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ '& > :not(style)': { m: 1 } }} className="fixed bottom-10 right-10 " onClick={() => setShowSessionTimer(true)}  >
                <Fab color="mariner" aria-label="add" onMouseEnter={() => setOnHover(true)} onMouseLeave={() => setOnHover(false)} >
                    <PlayCircleRounded className="text-white" fontSize="large"  /> 
                </Fab>
            </Box>
        </ThemeProvider>
    );
}

export default SessionButton;