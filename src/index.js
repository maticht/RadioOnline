import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import RadioStationStore from "./store/RadioStationStore";
import {HelmetProvider} from 'react-helmet-async';

export const Context = createContext(null)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Context.Provider value={{
        radioStation: new RadioStationStore()
    }}>
        <HelmetProvider>
            <App/>
        </HelmetProvider>
    </Context.Provider>,
);
