import "./SignIn.css";
import React from "react";
import Frame from "../../assets/Frame.png";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await fetch("http://localhost:3000/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            if (response.userToken) {
              Cookies.set("token", response.userToken, {
                expires: 7,
                secure: true,
              });
              console.log("Login successful!");
              navigate("/dashboard");
            }
          } else {
            alert(response.message);
          }
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <>
      <div className="sign_in_container">
        <div className="left">
          <h1 className="left_title">
            Welcome to <br />
            ManageBACK
          </h1>
          <div className="left_subtitle">
            Here, we believe that build a strong professional networks begins
            with your participation. <br />
            We are delighted to offer a modern and user-friendly service to
            ensure you have the best experience
          </div>
          <a href="/signup">
            <button>Join Now!</button>
          </a>
          <img className="media" src={Frame} />
        </div>

        <div className="right">
          <form className="sign_in_form" onSubmit={handleLogin}>
            <label className="sign_in_title">Sign In</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input className="fill_button" type="submit" value="Login" />
          </form>
        </div>
      </div>
    </>
  );
}

export default SignIn;
