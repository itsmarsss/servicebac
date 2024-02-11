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
      <nav className="flex m-8 justify-between">
        <div className="font-bold">ManageBACK</div>
        <div className="flex space-x-12 font-bold">
          {pages.map((page) => (
            <a
              href={page.link}
              className="hover:underline hover:text-gray-500"
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
