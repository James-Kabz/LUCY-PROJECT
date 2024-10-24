// ResetPasswordForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useHistory } from 'react-router-dom';

const ResetPasswordForm = () => {
  const { token } = useParams();
  const history = useHistory();
  const [data, setData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev, [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000
      });
      return;
    }
    try {
      const response = await axios.post(`http://localhost:4000/api/user/resetPassword/${token}`, { password: data.password });
      if (response.status === 200) {
        toast.success('Password reset successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        history.replace('/loginUser');
      } else {
        toast.error('Password reset failed', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Error resetting password', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col bg-white p-52 rounded-lg shadow-md gap-5">
        <h1 className="text-2xl text-center font-bold mb-4">Reset Password</h1>
        <label className="block">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          name="password"
          value={data.password}
          onChange={handleChange}
          className="input-field mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <label className="block">Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={handleChange}
          className="input-field mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-5"
        >
          Reset Password
        </button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default ResetPasswordForm;
