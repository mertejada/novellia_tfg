import { useState } from "react";
import { HiCheck } from "react-icons/hi";

function StepsInterest({ formData, setFormData }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    const updatedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    setSelectedGenres(updatedGenres);

    setFormData({
      ...formData,
      genres: updatedGenres // Aquí usamos la versión actualizada de selectedGenres
    });
  };

  const genres = [
    "romance", "fantasy", "adventures", "drama"
  ];

  return (
    <div>
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => toggleGenre(genre)}
          style={{
            backgroundColor: selectedGenres.includes(genre) ? "#007bff" : "transparent",
            color: selectedGenres.includes(genre) ? "#fff" : "#000",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "5px 10px",
            margin: "5px",
            cursor: "pointer",
          }}
          value={genre}
        >
          {genre}
          {selectedGenres.includes(genre) }
        </button>
      ))}
    </div>
  );
}

export default StepsInterest;
