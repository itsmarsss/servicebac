import React from "react";
import Frame from "../../assets/Frame.png";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/user/signin", {
        email,
        password,
      });

      console.log("Response from server:", response);

      if (response.data && response.data.success && response.data.userToken) {
        const token = response.data.userToken;
        Cookies.set("token", token, { expires: 7, secure: true });
        console.log("Login successful!");
        navigate("/dashboard");
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        console.error("Server responded with error:", error.response.data);
      } else if (error.request) {
        console.error("No response received from the server");
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex flex-col p-[10rem] space-y-4">
          <h1 className="text-4xl font-bold">
            Welcome to <br />
            Platform Name
          </h1>
          <p className="font-medium">
            Here, we believe that build a strong professional networks begins
            with your participation. <br />
            We are delighted to offer a modern and user-friendly service to
            ensure you have the best experience
          </p>
          <a href="" className="text-[#4461F2] hover:underline font-bold">
            Join Now!
          </a>
          <img className="h-[20rem] w-[30rem]" src={Frame} />
        </div>

        <div className="flex items-center justify-evenly">
          <div className="flex flex-col p-[10rem] space-y-4">
            <label className="text-2xl font-bold">Sign In</label>
            <form
              className="flex justify-start flex-col space-y-2"
              onSubmit={handleLogin}
            >
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="bg-blue-400 hover:bg-blue-500 p-2 rounded-xl text-white"
                type="submit"
                value="Login"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
