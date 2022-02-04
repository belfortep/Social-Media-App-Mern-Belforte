import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {AuthContextProvider} from './context/AuthContext';

//con el authcontextprovider le estoy compartiendo el estado que esta en ese archivo a TODOS los children que hay
ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider> 
    <App />
    </AuthContextProvider>
    
  </React.StrictMode>,
  document.getElementById('root')
);


