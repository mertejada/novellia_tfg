import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddToList from "../common/AddToList";


const BookElement = ({ bookInfo, bookId }) => {

    const navigate = useNavigate();

    const [showAddToList, setShowAddToList] = useState(false);

    const toggleAddToList = () => {
        setShowAddToList(!showAddToList);
    }

    return (
        <div className="book-element bg-white py-10 rounded-lg border shadow-md flex items-center flex-col">
            <img
                src={bookInfo.cover}
                alt={bookInfo.title}
                className="w-46 h-72 object-cover rounded-lg img-shadow"
            />
            <div className="w-2/3 mt-10 ">
                <div className=" w-full flex items-center justify-evenly gap-10 ">
                    <div className="w-2/3">
                        <h3 className="text-lg font-semibold overflow-ellipsis" style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bookInfo.title}</h3>
                        <p className="text-sm text-crayola">{bookInfo.author}</p>
                        <p className="text-sm text-gray-400">{bookInfo.language}</p>


                    </div>

                    <div className="relative w-1/3 flex justify-end gap-5">
                    <PlaylistAddIcon className="cursor-pointer text-crayola" onClick={toggleAddToList} />
                    {showAddToList && <AddToList toggleAddToList={toggleAddToList} bookId={bookInfo.id} className="absolute right-0" />}
                    </div>
                    


                </div>

                <button
                    className="bg-gray-300 text-white p-2 rounded-lg mt-4 w-full "
                    onClick={() => navigate(`/book/${bookId}`)}
                >
                    See more
                </button>
            </div>
        </div>
    );
}

export default BookElement;
