const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "roles",
        key: "id",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Hash password before saving to database
  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(16);
    user.password = await bcrypt.hash(user.password, salt);
  });

  // Validate password method
  User.prototype.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  // Define relationships
  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "roleId", as: "role" });
  };

  return User;
};
