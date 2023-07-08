import React from "react";
import HomeScreen from "./pages/HomeScreen/HomeScreen";
import {Route, Routes, Navigate, BrowserRouter} from "react-router-dom";
import Admin from "./pages/Admin/Admin";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/admin" element={<Admin />} />
                    <Route path='/' element={<HomeScreen />}/>
                    <Route path="*" element={<HomeScreen />}/> {/*Отображение главной страницы на случай, если пользователь введет неверный url, например http://localhost:3000/m;lm;m*/}
                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App;
