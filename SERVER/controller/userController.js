const db = require("../model/dbConnect");
const users = db.users;
const Role = db.roles;
const createHttpError = require("http-errors");
const { signAccessToken, signRefreshToken } = require("../helpers/jwtHelpers");
const authSchema = require("../helpers/validateSchema");

module.exports = {
  addUser: async (req, res, next) => {
    try {
      const { roleId, email, password } = await authSchema.validateAsync(
        req.body
      );

      const exists = await users.findOne({ where: { email } });
      if (exists) {
        throw createHttpError.Conflict(`${email} has already been registered`);
      }

      // Include roleId when creating a new admin
      const newUser = new users({ roleId, email, password });
      const savedUser = await newUser.save();

      const accessToken = await signAccessToken(savedUser.id, roleId); // Pass roleId to token
      res.send({ accessToken });
    } catch (error) {
      console.log(error);

      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  getUsers: async (req, res, next) => {
    try {
      let getAllUsers = await users.findAll({
        include: [
          {
            model: Role,
            attributes: ["roleName"],
          },
        ],
      });
      res.status(200).send(getAllUsers);
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      let id = req.params.id;

      const updateUser = await users.update(req.body, {
        where: { id: id },
      });
      if (!users) {
        throw createHttpError(404, "User not found");
      }
      res.status(200).send(updateUser);
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const id = req.params.id;

      const deleteUser = await users.destroy({ where: { id: id } });

      if (deleteUser === 0) {
        throw createHttpError(404, "User not found");
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  fetchRoleName: async (req, res, next) => {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id);

      // Check if the role exists
      if (!role) {
        throw createHttpError(404, "Role not found");
      }

      res.status(200).send(role); // Change 201 to 200 for successful retrieval
    } catch (error) {
      // Handle Joi validation errors, if applicable
      if (error.isJoi === true) {
        return next(createHttpError(400, "Invalid Credentials")); // Use 400 for bad requests
      }
      next(error); // Pass any other errors to the error handler
    }
  },

  loginUser: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user = await users.findOne({ where: { email: result.email } });

      if (!user) throw createHttpError.NotFound("User not found");

      // Password check
      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch) throw createHttpError.Unauthorized("Invalid password");

      // Generate tokens
      const accessToken = await signAccessToken(user.id, user.roleId); // Include roleId if necessary
      const refreshToken = await signRefreshToken(user.id); // Adjusted to use user.id

      // Send roleId along with tokens
      res.send({ accessToken, refreshToken, roleId: user.roleId }); // Include roleId in response
    } catch (error) {
      if (error.isJoi === true)
        return next(createHttpError.BadRequest("Invalid Credentials"));
      next(error);
    }
  },
};
