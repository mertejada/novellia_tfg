import React, { useEffect } from "react";

import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';

import { db } from '../../services/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const AddList = ({ handleClose, currentUserLists }) => {

    const { user } = useAuth();
    const navigate = useNavigate();

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

    const addNewList = async () => {
        const listName = document.querySelector('input').value;

        if (listName) {
            try {
                const userDocRef = doc(db, 'users', user.uid);

                const camelCaseListName = listName
                    // Primero, asegúrate de que todo esté en minúsculas para comenzar uniformemente.
                    .toLowerCase()
                    // Sustituye los espacios entre palabras con una expresión que capitaliza la primera letra de cada palabra siguiente.
                    .replace(/\s+(.)/g, function (match, group1) {
                        return group1.toUpperCase();
                    });

                    //si la lista ya existe
                if (currentUserLists[camelCaseListName]) {
                    alert("List already exists");
                    handleClose();
                    return;
                }

                const updatedLists = {
                    ...currentUserLists,
                    [camelCaseListName]: [] // Agregar nueva lista con el nombre proporcionado
                };

                await updateDoc(userDocRef, {
                    lists: updatedLists
                });

                handleClose();
                navigate(`/bookshelf/${camelCaseListName}`);
            } catch (error) {
                console.log("Error adding new list:", error);
            }
        }
    }



    return (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white border shadow p-10  py-12 rounded-2xl w-1/4">

                <h2 className="text-2xl font-semibold mb-10">Add a new list</h2>
                
                <input type="text" placeholder="List name" className="w-full border border-gray-300 p-2 rounded-lg mb-5" />

                <div className="flex justify-between gap-5">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={addNewList}>Add list</button>
                    <button onClick={handleClose}>
                        <CloseRoundedIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddList;
