import React from "react";
import Home from "./pages/home/Home.jsx";
import SignIn from "./pages/signin/SignIn.jsx";
import SignUp from "./pages/signup/SignUp.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Submit from "./pages/submit/Submit.jsx";
import Nav from "./components/Nav.jsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit" element={<Submit />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
