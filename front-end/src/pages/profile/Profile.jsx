import "./Profile.css";
import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("company");

  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const getToken = () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/signin");
    }
    return token;
  };

  const handleUpdate = async (e) => {
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

      await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          authorization: `Bearer ${getToken()}`,
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
            toast.showSuccessAlert("Profile updated");
          } else {
            toast.showErrorAlert(response.message);
          }
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    try {
      fetch("/api/user/dashboard", {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            setFirstName(response.firstName);
            setLastName(response.lastName);
            setEmail(response.email);
            setAccountType(response.accountType);
            toast.showSuccessAlert("Fetched user data");
          } else {
            toast.showErrorAlert(response.message);
          }
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  return (
    <div className="profile">
      <form className="profile_form">
        <label className="profile_title">Update Profile</label>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            maxLength={25}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            maxLength={25}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            maxLength={50}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            maxLength={25}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Account Type:</label>
          <select onClick={(e) => setAccountType(e.target.value)}>
            <option value="company">Company</option>
            <option value="department">Department</option>
          </select>
        </div>
        <input
          className="fill_button"
          type="button"
          value="Update"
          onClick={handleUpdate}
        />
      </form>
    </div>
  );
}

export default Profile;
