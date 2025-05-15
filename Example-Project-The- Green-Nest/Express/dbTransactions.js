const { sequelize, ItemOrder, Item, ItemOrderPiece } = require("../models");

//***************** ORDERS *******************************************/

async function createItemOrderWithTransaction(itemOrderData, res) {
  try {
    const finalOrder = await sequelize.transaction(async (t) => {
      // Create a new Order directly
      const createdOrder = await ItemOrder.create(itemOrderData, {
        transaction: t,
      });

      console.log("New order created:", createdOrder.toJSON());

      // Create ItemOrderPiece for the current order
      await Promise.all(
        itemOrderData.ItemOrderPieces.map(async (orderItemData) => {
          // Find the product
          const product = await Item.findOne({
            where: { itemID: orderItemData.itemID },
            transaction: t,
          });

          if (!product) {
            throw new Error("No product with this ID exists!");
          }

          // Create a new ItemOrderPiece associated with the order and product
          await ItemOrderPiece.create(
            {
              ...orderItemData,
              itemOrderID: createdOrder.itemOrderID,
              itemID: product.itemID,
            },
            { transaction: t }
          );
        })
      );

      // Fetch the created order with associated items
      const finalOrder = await Item.findByPk(createdOrder.itemOrderID, {
        include: [{ model: ItemOrderPiece, as: "ItemOrderPieces" }],
        transaction: t,
      });

      if (!finalOrder) {
        console.error("Error during transaction: no finalItemOrder");
        throw { status: 500, message: "Internal server error" };
      }

      return finalOrder;
    });

    return finalOrder;
  } catch (error) {
    console.error("Error during transaction:", error);
    throw { status: 500, message: "Internal server error" };
  }
}
module.exports = {
  createItemOrderWithTransaction,
};
