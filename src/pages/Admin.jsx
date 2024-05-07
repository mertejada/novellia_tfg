
import React from "react";
import { useState } from "react";
import AdminBooks from "./admin/adminBooks/AdminBooks";
import AdminUsers from "./admin/adminUsers/AdminUsers";

const Admin = () => {
    const [showContent, setShowContent] = useState("books");

    const handleShowContent = (content) => {
        setShowContent(content);
    }

    const contents = {
        books: <AdminBooks />,
        users: <AdminUsers />,
        // settings: <AdminSettings />
    }

    return (
        <div>
            <h1>Admin</h1>
            <div>
                <button onClick={() => handleShowContent("books")}>Books</button>
                <button onClick={() => handleShowContent("users")}>Users</button>
                {/*<button onClick={() => handleShowContent("settings")}>Settings</button>*/} 
            </div>
            {contents[showContent]}
        </div>
    )
}

export default Admin;