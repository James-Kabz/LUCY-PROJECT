// ForgotPasswordForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/user/forgotPassword', { email });
      if (response.status === 200) {
        toast.success('Password reset link sent to your email', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      } else {
        toast.error('Failed to send reset link', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Error sending reset link', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col bg-white p-52 rounded-lg shadow-md gap-5">
        <h1 className="text-2xl text-center font-bold mb-4">Forgot Password</h1>
        <label className="block">Email</label>
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={handleChange}
          className="input-field mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-5"
        >
          Send Reset Link
        </button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
