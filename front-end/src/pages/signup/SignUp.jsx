import "./SignUp.css";
import React from "react";
import Frame from "../../assets/Frame.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("company");
  const navigate = useNavigate();

  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!firstName) {
        toast.showErrorAlert("First Name cannot be blank");
        return;
      }
      if (!lastName) {
        toast.showErrorAlert("Last Name cannot be blank");
        return;
      }
      if (!isEmail(email)) {
        toast.showErrorAlert("Incorrect email pattern");
        return;
      }
      if (!password) {
        toast.showErrorAlert("Password cannot be blank");
        return;
      }

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
              toast.showSuccessAlert("Registered successfully");
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
      <div className="sign_up_container">
        <div className="left">
          <h1 className="left_title">Already have an account?</h1>
          <a href="/signin">
            <button>Go To Login</button>
          </a>
          <img className="media" src={Frame} />
        </div>

        <div className="right">
          <form className="sign_up_form">
            <label className="sign_up_title">Sign Up</label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              maxLength={25}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              maxLength={25}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              maxLength={50}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              maxLength={25}
              onChange={(e) => setPassword(e.target.value)}
            />
            <select onClick={(e) => setAccountType(e.target.value)}>
              <option value="company">Company</option>
              <option value="department">Department</option>
            </select>

            <input
              className="fill_button"
              type="button"
              value="Register"
              onClick={handleLogin}
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
