import React from "react";
import HomeScreen from "./pages/HomeScreen/HomeScreen";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import VerifyAdminScreen from "./pages/verifyAdminScreen/verifyAdminScreen";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/admin/:token" exact element={<Admin />} />
                    <Route path="/verifyAdminScreen" element={<VerifyAdminScreen/>}/>
                    <Route path='/' element={<HomeScreen />}/>
                    <Route path="*" element={<HomeScreen />}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
