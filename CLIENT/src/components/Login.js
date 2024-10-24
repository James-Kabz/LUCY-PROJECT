import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const { login, refreshToken } = useContext(AuthContext);
  const [data, setLoginData] = useState({
    email: "",
    password: "",
  });
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (data.email.length === 0 || !data.email.includes("@")) {
        toast.error("Enter a valid email", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      } else if (data.password.length < 8) {
        toast.error("Password must be at least 8 characters", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      } else {
        const response = await axios.post(
          "http://localhost:4000/api/user/loginUser",
          data
        );
        if (response.status === 200) {
          const {
            accessToken,
            refreshToken: newRefreshToken,
            roleId,
          } = response.data;

          sessionStorage.setItem("accessToken", accessToken);
          sessionStorage.setItem("refreshToken", newRefreshToken);
          sessionStorage.setItem("userRole", roleId); // Store roleId or role name

          login(roleId); // Pass the role to the login function in context
          history.replace("/dashboard");

          toast.success(`Login Successful. Welcome`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        } else if (response.status === 401) {
          const newAccessToken = await refreshToken();

          if (newAccessToken) {
            await handleLogin(e);
          } else {
            toast.error("Invalid username/password", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000,
            });
          }
        } else {
          console.error("Authentication Failed");
          toast.error("Authentication Failed", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Invalid username/password", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl text-center font-bold mb-6 text-pink-700">
          Login
        </h1>
        <h2 className="text-lg text-center mb-6 text-gray-600">
          Sign in to Aura Cosmetica
        </h2>

        {/* Email Field */}
        <label className="block mb-2 text-gray-700 font-medium">Email</label>
        <input
          type="email"
          placeholder="Enter your Email"
          name="email"
          value={data.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500 mb-5"
        />

        {/* Password Field */}
        <label className="block mb-2 text-gray-700 font-medium">Password</label>
        <input
          type="password"
          placeholder="Enter your Password"
          name="password"
          value={data.password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500 mb-6"
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition duration-300 focus:outline-none focus:ring focus:ring-blue-200 mb-4"
        >
          Login
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default LoginForm;
