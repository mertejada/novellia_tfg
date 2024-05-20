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
        // Bloquear el scroll al montar el componente
        document.body.style.overflow = 'hidden';

        // Función de limpieza que se ejecuta al desmontar el componente
        return () => {
            // Reactivar el scroll al desmontar el componente
            document.body.style.overflow = 'auto';
        };
    }, []);

    //que al hacer click fuera del modal, se cierre
    const handleClickOutside = (e) => {
        if (e.target.classList.contains('fixed')) {
            handleClose();
        }
    }

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

                if (currentUserLists[camelCaseListName]) {
                    alert("List already exists");
                    handleClose();
                    return;
                }

                const updatedLists = {
                    ...currentUserLists,
                    [camelCaseListName]: []
                };

                await updateDoc(userDocRef, {
                    lists: updatedLists
                });

                handleClose();
            } catch (error) {
                console.log("Error adding new list:", error);
            }
        }
    }



    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50" onClick={handleClickOutside}>
            <div className="bg-white border shadow p-10  py-12 rounded-2xl " >

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
