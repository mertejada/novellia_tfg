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
            <div className="flex flex-col bg-white p-10 py-12 sm:p-8 gap-5 rounded-xl m-20">
                <div className="flex justify-between items-center gap-10 mb-5">
                    <h2 className="text-2xl font-normal "><span className="gradient text-gradient font-light ">Add a</span>  new list</h2>
                        <CloseRoundedIcon onClick={handleClose} className="cursor-pointer text-gray-300 hover:text-black" />
                    </div>
                <div className="flex flex-col items-start gap-2">
                <p className="text-gray-500">Name of the new list:</p>
                <input type="text" placeholder="List name" className="w-full border border-gray-300 p-2 rounded-lg mb-5" />
                </div>
                <button className="button bg-crayola text-white" onClick={addNewList}>Add list</button>

            </div>
        </div>
    );
};

export default AddList;
