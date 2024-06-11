import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useMediaQueries } from '../../contexts/MediaQueries';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
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


  return (
    <div className="flex flex-col gap-2 items-center justify-center overflow-y-auto  h-fit" >
      <h2 className="text-2xl text-center mt-10 w-3/4 text-gray-300">Choose 3 genres you are interested in!</h2>    
      <div className=" flex flex-wrap justify-center items-center p-5 overflow-y-auto h-fit" style={{ maxHeight: isMobile ? "calc(60vh - 200px)" : "none" }}>
        {loading ? <p>Loading...</p> :
          <div className=" grid gap-2 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-center overflow-y-auto h-fit" >
            {genres.map((genre, index) => (
              genre !== "unknown" && (
                <button
                  key={index}
                  className=" px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: genresData[index].color }}
                  onClick={() => {
                    toggleGenre(genre);
                  }}
                >
                  {selectedGenres.includes(genre) && <CheckCircleRoundedIcon className="mr-2" />}
                  {genresData[index].name}
                </button>

              )
            ))}
          </div>
        }
      </div>
    </div>
  );
}

export default StepsInterest;
