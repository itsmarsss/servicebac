import "./SignIn.css";
import React from "react";
import Frame from "../../assets/Frame.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isEmail(email)) {
      toast.showErrorAlert("Incorrect email pattern");
      return;
    }

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
              toast.showSuccessAlert("Logged in");
              navigate("/dashboard");
            }
          } else {
            toast.showErrorAlert(response.message);
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
          <form className="sign_in_form">
            <label className="sign_in_title">Sign In</label>
            <input
              type="text"
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
            <input
              className="fill_button"
              type="button"
              value="Login"
              onClick={handleLogin}
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default SignIn;
