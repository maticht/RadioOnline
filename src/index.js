import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import RadioStationStore from "./store/RadioStationStore";
export const Context = createContext(null)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Context.Provider value ={{
       radioStation: new RadioStationStore(),
    }}>
        <App />
    </Context.Provider>,
);
