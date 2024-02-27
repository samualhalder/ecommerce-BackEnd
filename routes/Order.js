const express = require("express");
const {
  fetchOrderByUser,
  addToOrder,
  updateOrder,
  deleteOrder,
} = require("../controller/Order");

const router = express.Router();

router
  .post("/", addToOrder)
  .get("/:id", fetchOrderByUser)
  .patch("/:id", updateOrder)
  .delete("/:id", deleteOrder);
exports.router = router;
