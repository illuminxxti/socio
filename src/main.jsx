import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import { Combination } from './firebase/messageuser.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <BrowserRouter>
    <Combination>
    <App />
    </Combination>
    </BrowserRouter>

  </React.StrictMode>
)
