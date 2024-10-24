const db = require("../model/dbConnect");
const sales = db.sales;
const items = db.items;
module.exports = {
  makeSale: async (req, res, next) => {
    try {
      let info = {
        quantity_sold: req.body.quantity_sold,
        total_price: req.body.total_price,
        item_id: req.body.item_id,
        sale_date: req.body.sale_date,
      };

      const item = await items.findOne({ where: { item_id: info.item_id } });
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }

      if (info.quantity_sold > item.quantity_in_stock) {
        return res
          .status(400)
          .send({ message: "Quantity sold exceeds quantity in stock" });
      }

      await items.decrement("quantity_in_stock", {
        by: info.quantity_sold,
        where: { item_id: info.item_id },
      });
      const makeSale = await sales.create(info);

      res.status(200).send(makeSale);
    } catch (error) {
      next(error);
    }
  },

  getAllSales: async (req, res, next) => {
    try {
      let getAllSales = await sales.findAll({
        include: [
          {
            model: items,
            attributes: ["item_name"],
          },
        ],
        order: [
          ["sale_date", "DESC"], // Sort by sale_date in descending order
        ],
      });
      res.status(200).send(getAllSales);
    } catch (error) {
      next(error);
    }
  },
};
