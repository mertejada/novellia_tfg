import React from 'react';
//importar una imagen para usarla como fondo con tailwindcss
import bkImg from '../assets/img/test.jpg';

const Login = () => {
    return (
        <section  style={{backgroundImage: `url(${bkImg})`}} className='  bg-cover bg-center bg-no-repeat font-poppins font-light h-fit'>
            <div className=" flex flex-col items-start justify-center">
                <h1 className="p-4 text-4xl text-centerd">Start your <span className=' font-extrabold font-playfair text-6xl '>literature adventure</span></h1>
                
                    <div class = "bg-white shadow-gray-500 drop-shadow-md shadow-md rounded-3xl   p-10 w-fit h-fit flex flex-col items-start">
                        <form className='flex flex-col gap-2'>
                            <input type="email" placeholder="Your mail" className="block w-60  h-10 m-2 border-1 bg-gray-100 rounded-xl p-4" />
                            <input type="password" placeholder="Password" className="block w-60  h-10 m-2 bg-gray-100 rounded-xl p-4" />
                            <button type="submit" className="block w-60 h-10 p-2 m-2 button gradient rounded-3xl">Log in</button>
                        </form>
                        <a className=" h-10 w-60 p-2 m-2 text-gray rounded-md text-center" href='#'>Don't have an account? <span class= "text-blue-500">Sign up here.</span></a>
                    </div>
            </div>
        </section>
           
    );
}

export default Login;
