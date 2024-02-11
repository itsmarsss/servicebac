import "./Dashboard.css";
import React from "react";
import Company from "../../components/company/Company.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Dashboard() {
  const [accountType, setAccountType] = useState("");
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
      fetch("http://localhost:3000/api/user/dashboard", {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            setAccountType(response.accountType);
          } else {
            alert(response.message);
          }
        });
    } catch (error) {
      console.error("Error getting dashboard:", error);
    }
  }, []);

  return (
    <>
      <div className="dashboard">
        <div className="title">
          {accountType === "company" ? "Services:" : "Dashboard:"}
        </div>
        {accountType === "company" ? <Company /> : <Company />}
      </div>
    </>
  );
}

export default Dashboard;
