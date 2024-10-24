const db = require("../model/dbConnect");
const createHttpError = require("http-errors");
const Role = db.roles;
module.exports = {
  // Create a new role
  createRole: async (req, res, next) => {
    try {
      const { roleName } = req.body;
      const role = await Role.create({ roleName });
      res.status(201).json(role);
    } catch (error) {
      next(createHttpError(500, "Failed to create role"));
    }
  },

  // Get all roles
  getAllRoles: async (req, res, next) => {
    try {
      const roles = await Role.findAll();
      res.status(200).json(roles);
    } catch (error) {
      next(createHttpError(500, "Failed to retrieve roles"));
    }
  },

  // Get a role by ID
  getRoleById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id);
      if (!role) {
        throw createHttpError(404, "Role not found");
      }
      res.status(200).json(role);
    } catch (error) {
      next(error);
    }
  },

  // Update a role by ID
  updateRole: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { roleName } = req.body;

      const role = await Role.findByPk(id);
      if (!role) {
        throw createHttpError(404, "Role not found");
      }

      role.roleName = roleName;
      await role.save();
      res.status(200).json(role);
    } catch (error) {
      next(createHttpError(500, "Failed to update role"));
    }
  },

  // Delete a role by ID
  deleteRole: async (req, res, next) => {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id);
      if (!role) {
        throw createHttpError(404, "Role not found");
      }

      await role.destroy();
      res.status(204).send();
    } catch (error) {
      next(createHttpError(500, "Failed to delete role"));
    }
  },
};
