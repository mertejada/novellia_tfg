import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useMediaQueries } from '../../contexts/MediaQueries';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function StepsInterest({ formData, setFormData }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [genresData, setGenresData] = useState([]);
  const { isMobile } = useMediaQueries();

  const getGenres = async () => {
    const querySnapshot = await getDocs(collection(db, "genres"));
    const genres = querySnapshot.docs.map(doc => doc.id);
    const genresData = querySnapshot.docs.map(doc => doc.data());
    setGenres(genres);
    setGenresData(genresData);
    setLoading(false);
  };

  useEffect(() => {
    getGenres();
  }, []);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((selected) => selected !== genre));
    } else {
      if (selectedGenres.length < 3) {
        setSelectedGenres([...selectedGenres, genre]);
      }
    }
  };

  useEffect(() => {
    // Update formData when selectedGenres change
    setFormData({
      ...formData,
      genres: selectedGenres,
    });
  }, [selectedGenres, setFormData]);


  console.log("se:",selectedGenres);
  console.log(formData.genres);

  return (
    <div className="grid gap-10 my-8 overflow-y-auto h-fit" style={{ maxHeight: isMobile ? "calc(60vh - 200px)" : "none" }}>
      <h2 className="text-2xl text-center mt-10 text-gray-300">Choose 3 genres you are interested in!</h2>    <div className=" flex flex-wrap justify-center py-10 px-3 overflow-y-auto h-fit" style={{ maxHeight: isMobile ? "calc(60vh - 200px)" : "none" }}>
        {loading ? <p>Loading...</p> :   
        genres.map((genre, index) => (
          genre !== "unknown" && (
            <button
              key={index}
              className="m-2 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: genresData[index].color }}
              onClick={() => {
                toggleGenre(genre);
              }}
            >
              {selectedGenres.includes(genre) && <CheckCircleIcon className="mr-2" />}
              {genresData[index].name}
            </button>
          )

        ))}
      </div>
    </div>
  );
}

export default StepsInterest;
