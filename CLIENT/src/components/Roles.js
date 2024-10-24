import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false); // Delete User Modal
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false); // Edit User Modal
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [userToDelete, setUserToDelete] = useState(null); // Track user to delete
  const [userToEdit, setUserToEdit] = useState(null); // Track user to edit

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/roles");
      setRoles(response.data);
    } catch (error) {
      toast.error("Failed to fetch roles");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/user/getUsers"
      );
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateRole(editId, roleName);
    } else {
      await addRole(roleName);
    }
  };

  const addRole = async (roleName) => {
    try {
      const response = await axios.post("http://localhost:4000/api/roles", {
        roleName: roleName,
      });
      setRoles([...roles, response.data]);
      toast.success("Role added successfully!");
      resetForm();
    } catch (error) {
      toast.error("Failed to add role");
    }
  };

  const updateRole = async (id, roleName) => {
    try {
      await axios.put(`http://localhost:4000/api/roles/${id}`, {
        roleName: roleName,
      });
      const updatedRoles = roles.map((r) =>
        r.id === id ? { ...r, roleName: roleName } : r
      );
      setRoles(updatedRoles);
      toast.success("Role updated successfully!");
      resetForm();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleEdit = (role) => {
    setRoleName(role.roleName);
    setIsEditing(true);
    setEditId(role.id);
  };

  const openDeleteModal = (role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const deleteRole = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/roles/${id}`);
      setRoles(roles.filter((role) => role.id !== id));
      toast.success("Role deleted successfully!");
      closeDeleteModal();
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  const resetForm = () => {
    setRoleName("");
    setIsEditing(false);
    setEditId(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  // Handle adding a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/user/addUser", {
        email,
        password,
        roleId,
      });
      toast.success("User added successfully!");
      fetchUsers();
      closeAddUserModal();
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const openAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRoleId("");
  };

  // Handle deleting user
  const openDeleteUserModal = (user) => {
    setUserToDelete(user);
    setIsDeleteUserModalOpen(true);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/user/deleteUser/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully!");
      closeDeleteUserModal();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const closeDeleteUserModal = () => {
    setIsDeleteUserModalOpen(false);
    setUserToDelete(null);
  };

  // Handle editing user
  const openEditUserModal = (user) => {
    setUserToEdit(user);
    setEmail(user.email);
    setRoleId(user.role.id);
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/user/updateUser/${userToEdit.id}`,
        {
          email,
          password,
          roleId,
        }
      );
      toast.success("User updated successfully!");
      fetchUsers();
      closeEditUserModal();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const closeEditUserModal = () => {
    setIsEditUserModalOpen(false);
    setUserToEdit(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRoleId("");
  };

  return (
    <div className="max-w-4xl max-h-7xl mx-auto mt-5 p-5 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">
        Manage Roles & Users
      </h2>

      <button
        onClick={openAddUserModal}
        className="bg-pink-500 text-white px-4 py-2 rounded mb-4 hover:bg-pink-600 transition duration-200"
      >
        Add User
      </button>

      <h3 className="text-lg font-bold text-pink-500 mb-2">Roles</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <label className="block text-gray-700">
          Role Name:
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
            className="border text-pink-950 border-gray-300 rounded p-2 mt-1 w-full"
          />
        </label>
        <button
          type="submit"
          className="mt-2 w-full bg-pink-500 text-white rounded px-4 py-2 hover:bg-pink-600 transition duration-200"
        >
          {isEditing ? "Update Role" : "Add Role"}
        </button>
      </form>

      <ul>
        {roles.map((role) => (
          <li
            key={role.id}
            className="flex justify-between items-center mb-2 p-2 border border-gray-200 rounded-lg bg-gray-100"
          >
            <span className="text-gray-800">{role.roleName}</span>
            <div>
              <button
                onClick={() => handleEdit(role)}
                className="bg-yellow-500 text-white rounded px-2 py-1 mr-2 hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(role)}
                className="bg-red-500 text-white rounded px-2 py-1 mr-2 hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-bold text-pink-500 mt-6 mb-2">Users</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center mb-2 p-2 border border-gray-200 rounded-lg bg-gray-100"
          >
            <span className="text-gray-800">
              {user.email} - {user.role.roleName}
            </span>
            <div>
              {/* <button
                onClick={() => openEditUserModal(user)}
                className="bg-yellow-500 text-white rounded px-2 py-1 mr-2 hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button> */}
              <button
                onClick={() => openDeleteUserModal(user)}
                className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onRequestClose={closeAddUserModal}
        contentLabel="Add User"
        className="max-w-md mx-auto mt-24 p-5 border border-gray-300 rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Add New User</h3>
        <form onSubmit={handleAddUser}>
          <label className="block text-gray-700">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          <label className="block text-gray-700 mt-3">
            Role:
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-gray-700 mt-3 relative">
            Password:
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
            <button
              type="button"
              className="absolute right-2 top-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </label>
          <label className="block text-gray-700 mt-3">
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          <button
            type="submit"
            className="mt-4 w-full bg-pink-500 text-white rounded px-4 py-2 hover:bg-pink-600 transition duration-200"
          >
            Add User
          </button>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteUserModalOpen}
        onRequestClose={closeDeleteUserModal}
        contentLabel="Delete User"
        className="max-w-sm mx-auto mt-24 p-5 border border-gray-300 rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Confirm User Deletion</h3>
        <p>Are you sure you want to delete the user "{userToDelete?.email}"?</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={closeDeleteUserModal}
            className="mr-2 bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteUser(userToDelete?.id)}
            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition duration-200"
          >
            Delete
          </button>
        </div>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Role"
        className="max-w-sm mx-auto mt-24 p-5 border border-gray-300 rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
        <p>
          Are you sure you want to delete the role "{roleToDelete?.roleName}"?
        </p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={closeDeleteModal}
            className="mr-2 bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteRole(roleToDelete.id)}
            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition duration-200"
          >
            Delete
          </button>
        </div>
      </Modal>
      {/* Edit User Modal */}
      <Modal
        isOpen={isEditUserModalOpen}
        onRequestClose={closeEditUserModal}
        contentLabel="Edit User"
        className="max-w-md mx-auto mt-24 p-5 border border-gray-300 rounded-lg bg-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Edit User</h3>
        <form onSubmit={handleUpdateUser}>
          <label className="block text-gray-700">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          <label className="block text-gray-700 mt-3">
            Role:
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-gray-700 mt-3">
            New Password (optional):
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          <label className="block text-gray-700 mt-3">
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          <button
            type="submit"
            className="mt-4 w-full bg-pink-500 text-white rounded px-4 py-2 hover:bg-pink-600 transition duration-200"
          >
            Update User
          </button>
        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default RolesPage;
