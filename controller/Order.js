const { Order } = require("../model/Order");

exports.fetchOrderByUser = async (req, res) => {
  const { user } = req.query;
  try {
    const OrderItems = await Order.find({ user: user });
    res.status(201).json(OrderItems);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.addToOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const docs = await order.save();
    res.status(201).json(docs);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const Order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(Order);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await Order.findByIdAndDelete(id);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
