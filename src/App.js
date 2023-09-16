import React from "react";
import HomeScreen from "./pages/HomeScreen/HomeScreen";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import VerifyAdminScreen from "./pages/verifyAdminScreen/verifyAdminScreen";
<<<<<<< HEAD
=======
import ContactsScreen from "./pages/ContactsScreen/ContactsScreen";
import OwnersScreen from "./pages/OwnersScreen/OwnersScreen";
import PrivacyPolicyScreen from "./pages/PrivacyPolicyScreen/PrivacyPolicyScreen";
>>>>>>> deb7e21556671a12e89aeb549aaf0eb6dbd58a31

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/admin/:token" exact element={<Admin />} />
<<<<<<< HEAD
                    <Route path="/verifyAdminScreen" element={<VerifyAdminScreen />} />
                    <Route path='/' element={<HomeScreen />}/>
                    <Route path="*" element={<HomeScreen />}/>
=======
                    <Route path="/verifyAdminScreen" element={<VerifyAdminScreen/>}/>
                    <Route path='/' element={<HomeScreen />}/>
                    <Route path='/:radioId' element={<HomeScreen />}/>
                    <Route path='/favorites' element={<HomeScreen/>}/>
                    <Route path='/favorites/:radioId' element={<HomeScreen/>}/>
                    <Route path="*" element={<HomeScreen />}/>
                    <Route path="/contacts" element={<ContactsScreen />} />
                    <Route path="/owners" element={<OwnersScreen />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
>>>>>>> deb7e21556671a12e89aeb549aaf0eb6dbd58a31
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
