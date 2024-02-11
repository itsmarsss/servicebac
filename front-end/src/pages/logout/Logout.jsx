import "./Logout.css";
import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Logout() {
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    Cookies.remove("token");
    setLoggedOut(true);
  }, []);

  return (
    <div className="loggedOut_text">
      {loggedOut ? "Logged out..." : "Logging out..."}
    </div>
  );
}

export default Logout;
