const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");

main().catch((err) => console.log(err));
server.use(express.json());
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("data base connected");
}

server.get("/", (req, res) => {
  res.send({ status: 404 });
});
server.post("/products", createProduct);

server.listen(8080, () => {
  console.log("sarver is started");
});
