const { Cart } = require("../model/Cart");

exports.fetchCartByUser = async (req, res) => {
  const { user } = req.query;
  try {
    const cartItems = await Cart.find({ user: user })
      .populate("user")
      .populate("product");
    res.status(201).json(cartItems);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.addToCart = async (req, res) => {
  const cart = new Cart(req.body);
  try {
    const docs = await cart.save();
    const result = await docs.populate("product");
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.deleteCart = async (req, res) => {
  const { id } = req.params;
  try {
    const docs = await Cart.findByIdAndDelete(id);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
