import "./Profile.css";
import React from "react";
import Loader from "../../components/loader/Loader.jsx";
import Nav from "../../components/nav/Nav.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("select_one");
  const navigate = useNavigate();

  const getToken = () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/signin");
    }
    return token;
  };

  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const handleUpdate = async (e) => {
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

      setLoading(true);
      await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            toast.showSuccessAlert("Profile updated");
          } else {
            toast.showErrorAlert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      fetch("/api/user/dashboard", {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            setAccountType(response.accountType);
            if (response.accountType === "company") {
              setCompanyName(response.companyName);
              setCity(response.city);
              setCountry(response.country);
            } else {
              setFirstName(response.firstName);
              setLastName(response.lastName);
            }
            setEmail(response.email);
            toast.showSuccessAlert("Fetched user data");
          } else {
            toast.showErrorAlert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  return (
    <>
      <Nav />
      <div className="profile_container">
        {loading && <Loader />}
        <form className="profile_form">
          <label className="profile_title">Update profile</label>
          <div>
            <label htmlFor="accountType">Account type</label>
            <select
              onChange={(e) => setAccountType(e.target.value)}
              onClick={(e) => setAccountType(e.target.value)}
              value={accountType}
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

              <button className="fill_button" onClick={handleUpdate}>
                Update
              </button>
            </>
          )}
        </form>
        <div className="bottom_text">
          Want to log out? <a href="/logout">Log out</a>
        </div>
      </div>
    </>
  );
}

export default Profile;
