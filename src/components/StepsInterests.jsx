import { useState } from "react";

function StepsInterest({ formData, setFormData }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      if (selectedGenres.length === 3) return;
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const updateFormData = () => {
    setFormData({
      ...formData,
      genres: selectedGenres
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
          onClick={() => {
            toggleGenre(genre);
            updateFormData();
          }}
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
        </button>
      ))}
    </div>
  );
}

export default StepsInterest;
