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
    <>
      <div className="loggedOut_text">
        {loggedOut ? "Logged out..." : "Logging out..."}
      </div>
      <div className="loggedOut_signin_cont">
        <a className="loggedOut_signin" href="/signin">
          <button>Go To Sign In</button>
        </a>
      </div>
    </>
  );
}

export default Logout;
