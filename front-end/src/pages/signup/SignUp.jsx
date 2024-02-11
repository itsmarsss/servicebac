import "./SignUp.css";
import React from "react";
import Frame from "../../assets/Frame.png";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("company");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          accountType: accountType,
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
              console.log("Register successful!");
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
      <div className="sign_up_container">
        <div className="left">
          <h1 className="left_title">Already have an account?</h1>
          <a href="/signin">
            <button>Go To Login</button>
          </a>
          <img className="media" src={Frame} />
        </div>

        <div className="right">
          <form className="sign_up_form" onSubmit={handleLogin}>
            <label className="sign_up_title">Sign Up</label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
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
            <select onClick={(e) => setAccountType(e.target.value)}>
              <option value="company">Company</option>
              <option value="department">Department</option>
            </select>

            <input className="fill_button" type="submit" value="Register" />
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
