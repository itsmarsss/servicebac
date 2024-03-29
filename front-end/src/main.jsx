import React from "react";
import Home from "./pages/home/Home.jsx";
import SignIn from "./pages/signin/SignIn.jsx";
import Register from "./pages/register/Register.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Logout from "./pages/logout/Logout.jsx";
import Deletion from "./pages/deletion/Deletion.jsx";
import Service from "./pages/service/Service.jsx";
import PageNotFound from "./pages/pageNotFound/PageNotFound.jsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/deletion" element={<Deletion />} />
        <Route path="/service/*" element={<Service />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
    <ToastContainer
      position="bottom-right"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </React.StrictMode>
);
