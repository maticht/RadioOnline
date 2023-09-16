import React from "react";
import HomeScreen from "./pages/HomeScreen/HomeScreen";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import VerifyAdminScreen from "./pages/verifyAdminScreen/verifyAdminScreen";
import ContactsScreen from "./pages/ContactsScreen/ContactsScreen";
import OwnersScreen from "./pages/OwnersScreen/OwnersScreen";
import PrivacyPolicyScreen from "./pages/PrivacyPolicyScreen/PrivacyPolicyScreen";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/admin/:token" exact element={<Admin />} />
                    <Route path="/verifyAdminScreen" element={<VerifyAdminScreen/>}/>
                    <Route path='/' element={<HomeScreen />}/>
                    <Route path='/:radioId' element={<HomeScreen />}/>
                    <Route path='/favorites' element={<HomeScreen/>}/>
                    <Route path='/favorites/:radioId' element={<HomeScreen/>}/>
                    <Route path="*" element={<HomeScreen />}/>
                    <Route path="/contacts" element={<ContactsScreen />} />
                    <Route path="/owners" element={<OwnersScreen />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
