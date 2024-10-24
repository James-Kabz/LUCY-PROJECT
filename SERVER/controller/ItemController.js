const db = require("../model/dbConnect");
const createHttpError = require("http-errors");
const items = db.items;

module.exports = {
  addItem: async (req, res, next) => {
    try {
      let info = {
        item_name: req.body.item_name,
        quantity_in_stock: req.body.quantity_in_stock,
        price: req.body.price,
        image: req.body.image,
      };

      const addItem = await items.create(info);
      res.status(200).send(addItem);
    } catch (error) {
      next(error);
    }
  },

  getItem: async (req, res, next) => {
    try {
      let id = req.params.id;
      let Item = await items.findOne({
        where: {
          item_id: id,
        },
      });
      if (!items) {
        throw createHttpError(404, "Item not found");
      }
      res.status(200).send(Item);
    } catch (error) {
      next(error);
    }
  },
  getAllItems: async (req, res, next) => {
    try {
      let getAllItems = await items.findAll();
      res.status(200).send(getAllItems);
    } catch (error) {
      next(error);
    }
  },

  updateItem: async (req, res, next) => {
    try {
      let id = req.params.id;

      const updateItem = await items.update(req.body, {
        where: { item_id: id },
      });
      if (!items) {
        throw createHttpError(404, "Item not found");
      }
      res.status(200).send(updateItem);
    } catch (error) {
      next(error);
    }
  },

  deleteItem: async (req, res, next) => {
    try {
      const id = req.params.id;

      const deleteItem = await items.destroy({ where: { item_id: id } });

      if (deleteItem === 0) {
        throw createHttpError(404, "Item not found");
      }

      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
