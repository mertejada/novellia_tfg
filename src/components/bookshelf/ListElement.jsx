import React, { useEffect, useState } from "react";

const ListElement = ({ name }) => {
    return (
        <li className="shadow-md h-max m-2 bg-white rounded-md">
            <h2>{name}</h2>
            
        </li>
    );
};


export default ListElement;
