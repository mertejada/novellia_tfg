import React, { useEffect } from "react";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const AddList = ({ handleClose }) => {
    useEffect(() => {
        window.scrollTo(0, 0, { behavior: 'smooth' });
        // Bloquear el scroll al montar el componente
        document.body.style.overflow = 'hidden';

        // Función de limpieza que se ejecuta al desmontar el componente
        return () => {
            // Reactivar el scroll al desmontar el componente
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white border shadow p-10 rounded-lg w-1/3">
                <button onClick={handleClose}>
                    <CloseRoundedIcon />
                </button>
                <h2 className="text-2xl font-semibold mb-10">Add a new list</h2>
                <input type="text" placeholder="List name" className="w-full border border-gray-300 p-2 rounded-lg mb-5" />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add list</button>
            </div>
        </div>
    );
};

export default AddList;
