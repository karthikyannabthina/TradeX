const orderService = require("./order.service");

const createOrder = async (req, res) => {
  const order = await orderService.createOrder({
    userId: req.user.userId,
    ...req.validated,
  });

  res.status(201).json({
    success: true,
    data: order,
  });
};

const getMyOrders = async (req, res) => {
  const orders =
    await orderService.getMyOrders(
      req.user.userId
    );

  res.status(200).json({
    success: true,
    data: orders,
  });
};

module.exports = {
  createOrder,
  getMyOrders,
};