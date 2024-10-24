// routes/RoleRoute.js
const express = require("express");
const router = express.Router();
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controller/RoleController"); // Adjust the path as needed

// Define your routes
router.post("/", createRole); // Create a new role
router.get("/", getAllRoles); // Get all roles
router.get("/:id", getRoleById); // Get a role by ID
router.put("/:id", updateRole); // Update a role by ID
router.delete("/:id", deleteRole); // Delete a role by ID

module.exports = router;
