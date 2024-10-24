import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserForm = () => {
  const [data, setRegData] = useState({
    user_email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    if (!data.user_email) {
      toast.error('Enter Email', { position: toast.POSITION.TOP_RIGHT });
    } else if (!data.password) {
      toast.error('Enter Password', { position: toast.POSITION.TOP_RIGHT });
    } else if (data.password.length < 8) {
      toast.error('Password must be at least 8 characters', { position: toast.POSITION.TOP_RIGHT });
    } else {
      axios.post('http://localhost:4000/api/user/addUser', data)
        .then((response) => {
          toast.success('User added successfully', { position: toast.POSITION.TOP_RIGHT });
          console.log('Registration successful:', response.data);
          // Optionally, redirect the user or show a success message
        })
        .catch((error) => {
          toast.error('Something went wrong when registering', { position: toast.POSITION.TOP_RIGHT });
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegistration}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg flex flex-col items-center gap-6"
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          User Registration
        </h1>

        {/* Email Input */}
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">Email:</label>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={data.user_email}
            name="user_email"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
          />
        </div>

        {/* Password Input */}
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">
            Password:
          </label>
          <input
            type="password"
            placeholder="Enter Your Password"
            value={data.password}
            name="password"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 mb-6"
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Register
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default UserForm;
