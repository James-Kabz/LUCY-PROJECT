module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("items", {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Item.associate = (models) => {
    Item.hasMany(models.Sale, { foreignKey: "item_id", as: "sales" }); // Association to Sales
  };

  return Item;
};
