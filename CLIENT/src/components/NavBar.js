import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClipboard,
  faPowerOff,
  faBars,
  faMehRollingEyes,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { logout, userRole } = useAuth(); // Get the user role from AuthContext
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false); // For mobile hamburger menu

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout();
      sessionStorage.clear();
      history.push("/Login"); // Redirect to login page after logout
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-pink-600 text-white w-full fixed top-0 z-50">
      <div className="flex justify-between items-center p-4">

        <div className="flex items-center">
          <h1 className="text-2xl lg:text-3xl font-semibold">
            Aura Cosmetica Shop
          </h1>
        </div>


        <div className="lg:hidden">
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
          >
            <FontAwesomeIcon icon={isOpen ? faPowerOff : faBars} size="lg" />
          </button>
        </div>

        <nav className="hidden lg:flex space-x-36 text-lg font-semibold">
          <Link
            to="/Dashboard"
            className="hover:bg-pink-500 py-2 px-4 rounded transition-colors"
          >
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>

          {(userRole === "admin" || userRole === "super-admin") && (
            <Link
              to="/AnalyticsPage"
              className="hover:bg-pink-500 py-2 px-4 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faClipboard} /> Analysis And Stock
              Management
            </Link>
          )}

          {userRole === "super-admin" && (
            <Link
              to="/Data"
              className="hover:bg-pink-500 py-2 px-4 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faClipboard} /> Sales Data
            </Link>
          )}

          {userRole === "super-admin" && (
            <Link
              to="/Roles"
              className="hover:bg-pink-500 py-2 px-4 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faMehRollingEyes} /> Manage Role & Users
            </Link>
          )}
        </nav>

        {/* Logout Button */}
        <div className="hidden lg:block">
          <button
            className="bg-red-600 text-white font-semibold rounded-md py-2 px-4 hover:bg-red-500 transition duration-300 ease-in-out"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Dropdown for Mobile View */}
      {isOpen && (
        <div className="lg:hidden bg-pink-700 text-lg font-semibold space-y-4 p-4">
          <Link
            to="/Dashboard"
            className="block hover:bg-pink-500 py-2 px-4 rounded transition-colors"
          >
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>


          {(userRole === "admin" || userRole === "super-admin") && (
            <Link
              to="/AnalyticsPage"
              className="block hover:bg-pink-500 py-2 px-4 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faClipboard} /> Analysis And Stock
              Management
            </Link>
          )}

          {userRole === "super-admin" && (
            <Link
              to="/Data"
              className="block hover:bg-pink-500 py-2 px-4 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faClipboard} /> Sales Data
            </Link>
          )}


          {userRole === "super-admin" && (
            <Link
              to="/Roles"
              className="block hover:bg-pink-500 py-2 px-4 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faMehRollingEyes} /> Manage Role & Users
            </Link>
          )}

          <button
            className="bg-red-600 w-full text-white font-semibold rounded-md py-2 px-4 hover:bg-red-500 transition duration-300 ease-in-out"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
