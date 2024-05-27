import "./Nav.css";
import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Nav() {
  const [pages, setPages] = useState([
    { title: "Home", link: "/", id: 1 },
    { title: "Sign in", link: "/signin", id: 2 },
  ]);

  const getToken = () => {
    const token = Cookies.get("token");
    if (token) {
      setPages([
        { title: "Dashboard", link: "/dashboard", id: 1 },
        { title: "Profile", link: "/profile", id: 2 },
        { title: "Logout", link: "/logout", id: 3 },
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
        <div className="logo">ServiceBac</div>
        <div className="pages">
          {pages.map((page) => (
            <a
              className={"page" + (page.link === "/signin" ? " signin" : "")}
              href={page.link}
              key={page.id}
            >
              {page.title}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Nav;
