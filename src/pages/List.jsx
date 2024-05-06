import React from "react";
import { useAuth } from '../contexts/AuthContext';

import ListBooks from "../components/list/ListBooks";


const List = () => {
    return (
        <div>
            <ListBooks />
        </div>
    ) 
}

export default List;