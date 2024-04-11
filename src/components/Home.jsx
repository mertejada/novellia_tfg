import React, { useEffect, useState } from "react";
import appFirebase from '../services/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { collection, query, where, getFirestore, getDocs } from 'firebase/firestore';
import UserRegister from "./UserRegister";

const auth = getAuth(appFirebase);

const Home = ({ userMail }) => {
    const [userRegisterInfo, setUserRegisterInfo] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const db = getFirestore(appFirebase);
                const usersRef = collection(db, "users");
                const userQuery = query(usersRef, where("email", "==", userMail));
                const querySnapshot = await getDocs(userQuery);

                if(querySnapshot.docs[0].data().registerInfo) {
                    setUserRegisterInfo(true);
                }

            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
            }
        };
        
        fetchUserData();
    }, [userMail]);

    return (
        <div>
            <h1>Home</h1>
            <button onClick={() => signOut(auth)}>Cerrar sesión</button>
            { !userRegisterInfo && <UserRegister />}
        </div>
    );
};

export default Home;
