import "./Nav.css";
import React from "react";
import { useState } from "react";

function Nav() {
  const [pages, setPages] = useState([
    { title: "Home", link: "/", id: 1 },
    { title: "Submit", link: "/submit", id: 2 },
    { title: "Login", link: "/signin", id: 3 },
    { title: "Register", id: 4 },
  ]);
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
