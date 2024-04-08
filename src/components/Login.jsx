import React from 'react';
//importar una imagen para usarla como fondo con tailwindcss
import bkImg from '../assets/img/test.jpg';

const Login = () => {
    return (
        <section>
            <div>
                <div>
                    <form>
                        <label className="w-80 h-10 p-2 m-2 text-lg font-bold text-gray-700">Iniciar sesión</label>
                        <input type="email" placeholder="Correo electrónico" className="block w-80 h-10 p-2 m-2 border-2 border-gray-300 rounded-md" />
                        <label className="w-80 h-10 p-2 m-2 text-lg font-bold text-gray-700">Contraseña</label>
                        <input type="password" placeholder="Contraseña" className="block w-80 h-10 p-2 m-2 border-2 border-gray-300 rounded-md" />
                        <button type="submit" className="block w-80 h-10 p-2 m-2 bg-gradient-to-r from-crayola via-pinkk to-blue-500 text-white font-bold rounded-md">Iniciar sesión</button>
                    </form>
                    <buttonc type="submit" className="block w-80 h-10 p-2 m-2 text-gray rounded-md text-center">Registrarse</buttonc>
                </div>
            </div>
            <img src={bkImg} alt="background" className="object-cover w-full h-screen" />
        </section>
           
    );
}

export default Login;
