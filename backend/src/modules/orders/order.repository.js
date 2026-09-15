const Order = require("./order.model");

const createOrder = async (
  data,
  session = null
) => {
  const orders = await Order.create(
    [data],
    { session }
  );

  return orders[0];
};

const findById = (orderId) => {
  return Order.findById(orderId);
};

const findByUser = (userId) => {
  return Order.find({
    userId,
  }).sort({
    createdAt: -1,
  });
};

module.exports = {
  createOrder,
  findById,
  findByUser,
};