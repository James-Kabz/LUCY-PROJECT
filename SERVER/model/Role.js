module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "roles",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      roleName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true, // Enable createdAt and updatedAt
    }
  );

  // Define relationships
  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: "roleId", as: "user" });
  };

  return Role;
};
