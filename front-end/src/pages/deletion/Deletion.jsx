import "./Deletion.css";
import React from "react";
import Nav from "../../components/nav/Nav.jsx";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Deletion() {
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    Cookies.remove("token");
    setDeleted(true);
  }, []);

  return (
    <>
      <Nav />
      <div className="deleted_text">
        {deleted ? "Deleted account..." : "Deleting account..."}
      </div>
      <div className="deleted_signin_cont">
        <a className="deleted_signin" href="/register">
          <button>Go To Sign Up</button>
        </a>
      </div>
    </>
  );
}

export default Deletion;
