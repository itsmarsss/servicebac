import "./PageNotFound.css";
import React from "react";
import Nav from "../../components/nav/Nav.jsx";

function PageNotFound() {
  return (
    <>
      <Nav />
      <div className="page404_text">Error 404: Page not found!</div>
      <div className="page404_home_cont">
        <a className="page404_home" href="/home">
          <button>Go Home</button>
        </a>
      </div>
    </>
  );
}

export default PageNotFound;
