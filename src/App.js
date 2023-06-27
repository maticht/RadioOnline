import React from "react";
import HomeScreen from "./pages/HomeScreen/HomeScreen";
import {Route, Routes, Navigate, BrowserRouter} from "react-router-dom";
import Admin from "./components/Admin";


function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/admin" exact element={<Admin />} />
                    <Route path='/' element={<HomeScreen />}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
