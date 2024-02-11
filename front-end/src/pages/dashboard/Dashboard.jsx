import "./Dashboard.css";
import React from "react";
import Company from "../../components/company/Company.jsx";
import Department from "../../components/department/Department.jsx";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Dashboard() {
  const [accountType, setAccountType] = useState("");

  const getToken = () => {
    return Cookies.get("token") || "";
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
