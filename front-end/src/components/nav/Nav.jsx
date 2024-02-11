import "./Nav.css";
import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Nav() {
  const [pages, setPages] = useState([
    { title: "Home", link: "/", id: 1 },
    { title: "Submit", link: "/submit", id: 2 },
    { title: "Login", link: "/signin", id: 3 },
    { title: "Register", link: "/signup", id: 4 },
  ]);

  const getToken = () => {
    const token = Cookies.get("token");
    if (token) {
      setPages([
        { title: "Dashboard", link: "/dashboard", id: 1 },
        { title: "Profile", link: "/profile", id: 2 },
        { title: "logout", link: "/Logout", id: 3 },
      ]);
    }
    return token;
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <>
      <nav className="nav">
        <div className="logo">ManageBACK</div>
        <div className="pages">
          {pages.map((page) => (
            <a className="page" href={page.link} key={page.id}>
              {page.title}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Nav;
