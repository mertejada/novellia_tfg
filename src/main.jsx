import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MediaQueriesProvider } from './contexts/MediaQueries'; 
import App from './NovelliaApp';


ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <MediaQueriesProvider>
                    <App />
            </MediaQueriesProvider>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
