import React from "react";
import { useNavigate } from "react-router-dom";

const BookElement = ({bookInfo}) => {

    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/book/${bookInfo.id}`)}>
            
            <h2>{bookInfo.title}</h2>
            <p>{bookInfo.author}</p>
            <p>{bookInfo.genre}</p>
            <p>{bookInfo.year}</p>
            <img src={bookInfo.cover} alt={bookInfo.title} />
        </div>
    );
}

export default BookElement;
