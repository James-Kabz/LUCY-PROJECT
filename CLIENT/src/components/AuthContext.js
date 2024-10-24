import React, { createContext, useState, useContext, useEffect } from "react";

// Function to fetch the role name from the API
const fetchRoleName = async (roleId) => {
  try {
    const response = await fetch(`http://localhost:4000/api/roles/${roleId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok"); // Throw error for non-2xx responses
    }
    const data = await response.json();
    return data.roleName; // Assuming the API returns an object with a roleName property
  } catch (error) {
    console.error("Failed to fetch role name:", error); // Log any fetch errors
    throw error; // Rethrow error to handle it in the login function
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoggedIn = localStorage.getItem("isLoggedIn");
    return savedLoggedIn === "true";
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole");
  });

  const [roleId, setRoleId] = useState(() => {
    return localStorage.getItem("roleId");
  });

  const login = async (roleId) => {
    if (!roleId) {
      console.error("roleId is undefined or null"); // Log error if roleId is not provided
      return; // Early return if roleId is invalid
    }

    setIsLoggedIn(true);
    setRoleId(roleId); // Set roleId in state

    try {
      // Fetch the role name using the roleId
      const roleName = await fetchRoleName(roleId);
      setUserRole(roleName); // Set the userRole from the fetched roleName

      // Save login state, roleId, and userRole to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("roleId", roleId); // Store roleId
      localStorage.setItem("userRole", roleName); // Store roleName
    } catch (error) {
      console.error("Login failed:", error); // Log any errors during login
      // Optionally, you could also clear the login state here if desired
      setIsLoggedIn(false);
      setRoleId(null);
      setUserRole(null);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRoleId(null); // Clear roleId on logout
    setUserRole(null); // Clear userRole

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("roleId"); // Remove roleId from localStorage
    localStorage.removeItem("userRole"); // Remove userRole from localStorage
  };

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("roleId"); // Remove roleId if not logged in
      localStorage.removeItem("userRole"); // Remove userRole if not logged in
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, userRole, roleId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return authContext;
};
