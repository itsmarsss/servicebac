import "./Register.css";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert.js";

function Register() {
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("select_one");
  const navigate = useNavigate();

  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (accountType === "company") {
        if (!companyName) {
          toast.showErrorAlert("Company name cannot be blank");
          return;
        }
        if (!country) {
          toast.showErrorAlert("Country cannot be blank");
          return;
        }
        if (!city) {
          toast.showErrorAlert("City cannot be blank");
          return;
        }
      } else {
        if (!firstName) {
          toast.showErrorAlert("First name cannot be blank");
          return;
        }
        if (!lastName) {
          toast.showErrorAlert("Last name cannot be blank");
          return;
        }
      }
      if (!isEmail(email)) {
        toast.showErrorAlert("Incorrect email pattern");
        return;
      }
      if (!password) {
        toast.showErrorAlert("Password cannot be blank");
        return;
      }

      const userData =
        accountType === "company"
          ? {
              accountType: accountType,
              companyName: companyName,
              city: city,
              country: country,
              email: email,
              password: password,
            }
          : {
              accountType: accountType,
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: password,
            };

      await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
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
      <a className="top_text" href="/">
        ServiceBac
      </a>
      <div className="sign_up_container">
        <form className="sign_up_form">
          <label className="sign_up_title">Create an account</label>
          <div>
            <label htmlFor="accountType">Account type</label>
            <select
              onChange={(e) => setAccountType(e.target.value)}
              onClick={(e) => setAccountType(e.target.value)}
            >
              {accountType === "select_one" ? (
                <option value="select_one">Select one</option>
              ) : (
                ""
              )}
              <option value="company">Company</option>
              <option value="department">Department</option>
            </select>
          </div>
          {accountType === "select_one" ? (
            ""
          ) : accountType === "company" ? (
            <>
              <div>
                <label htmlFor="companyName">Company name</label>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  maxLength={50}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  maxLength={25}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  maxLength={25}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="firstName">First name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  maxLength={25}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lastName">Last name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  maxLength={25}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </>
          )}
          {accountType === "select_one" ? (
            ""
          ) : (
            <>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
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

              <button className="fill_button" onClick={handleLogin}>
                Register
              </button>
            </>
          )}
        </form>
        <div className="bottom_text">
          Already have an account? <a href="/signin">Sign in</a>
        </div>
      </div>
    </>
  );
}

export default Register;
