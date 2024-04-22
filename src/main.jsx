import React from 'react'   // Importamos React para poder usar JSX
import ReactDOM from 'react-dom'   // Importamos ReactDOM para renderizar la aplicación
import { AuthProvider } from './contexts/AuthContext';
import App from './NovelliaApp'



ReactDOM.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );   // Renderizamos el componente App en el elemento con id root