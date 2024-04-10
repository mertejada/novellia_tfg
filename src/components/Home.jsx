import React from "react";

import bkImg from '../assets/img/test.jpg';

import appFirebase from '../services/firebase';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(appFirebase);

//conseguir el uid del usuario
//const user = auth.currentUser;
//const uid = user.uid;

const Home = ({userMail}) => {
    return (
        <div>
            <h1>Welcome to the Home Page, {userMail}</h1>
        </div>
    )
}

export default Home;