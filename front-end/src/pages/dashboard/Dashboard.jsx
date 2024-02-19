import "./Dashboard.css";
import React from "react";
import Nav from "../../components/nav/Nav.jsx";
import Company from "../../components/company/Company.jsx";
import Department from "../../components/department/Department.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";

function Dashboard() {
  const [accountType, setAccountType] = useState("company");
  const navigate = useNavigate();

  const getToken = () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/signin");
    }
    return token;
  };

  useEffect(() => {
    try {
      fetch("/api/user/dashboard", {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            setAccountType(response.accountType);
            toast.showSuccessAlert("Fetched dashboard");
          } else {
            toast.showErrorAlert(response.message);
          }
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  return (
    <>
      <Nav />
      <div className="dashboard">
        <div className="title">
          {accountType === "company" ? "Dashboard:" : "Services:"}
        </div>
        {accountType === "company" ? <Company /> : <Department />}
      </div>
    </>
  );
}

export default Dashboard;
