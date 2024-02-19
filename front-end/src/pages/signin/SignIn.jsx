import "./SignIn.css";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [week, setWeek] = useState(true);
  const navigate = useNavigate();

  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!isEmail(email)) {
        toast.showErrorAlert("Incorrect email pattern");
        return;
      }
      if (!password) {
        toast.showErrorAlert("Password cannot be blank");
        return;
      }

      await fetch("/api/user/signin", {
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
                expires: week ? 7 : 1,
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
      <a className="top_text" href="/">
        ManageBACK
      </a>
      <div className="sign_in_container">
        <form className="sign_in_form">
          <label className="sign_in_title">Sign in to proceed</label>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              maxLength={50}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              maxLength={25}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label class="checkbox_container">
              Stay signed in for a week
              <input
                type="checkbox"
                checked={week}
                onChange={(e) => setWeek(e.target.checked)}
              ></input>
              <span class="checkmark"></span>
            </label>
          </div>
          <button className="fill_button" onClick={handleLogin}>
            Login
          </button>
        </form>
        <div className="bottom_text">
          Don't have an account? <a href="/register">Sign up</a>
        </div>
      </div>
    </>
  );
}

export default SignIn;
