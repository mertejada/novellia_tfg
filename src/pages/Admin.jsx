
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
        <div className="content">
            <div className="flex justify-center gap-4 mt-4 text-lg my-4 "> {/* Add gap-4 class to the div */}
                <button onClick={() => handleShowContent("books")}>Books</button>
                <button onClick={() => handleShowContent("users")}>Users</button>
                {/*<button onClick={() => handleShowContent("settings")}>Settings</button>*/} 
            </div>
            {contents[showContent]}
        </div>
    )
}

export default Admin;