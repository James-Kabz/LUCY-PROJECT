module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define("sales", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "items", // Specify the model name as a string
        key: "item_id",
      },
      onDelete: "CASCADE", // Optional: Defines behavior on deletion
    },
    quantity_sold: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sale_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Sale.associate = (models) => {
    Sale.belongsTo(models.Item, { foreignKey: "item_id", as: "item" }); // Association to Item
  };

  return Sale;
};
