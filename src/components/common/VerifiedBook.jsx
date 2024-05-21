import React, { useState, useEffect } from "react";

import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import Popover from '@mui/material/Popover';



const VerifiedBook = ({fontSize}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);


    return (
        <>
            <VerifiedRoundedIcon className="text-green-500 mr-3" 
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                fontSize={fontSize}
            />
            <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        className="bg-none"
      >

        <div className="p-2 bg-white text-black">
            Book info verified
        </div>
      </Popover>
        </>
    );
}

export default VerifiedBook;