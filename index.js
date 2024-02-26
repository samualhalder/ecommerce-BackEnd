const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Product");
const brandsRouter = require("./routes/Brand");
const categoriesRouter = require("./routes/Category");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cors = require("cors");

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
main().catch((err) => console.log(err));
server.use(express.json());
server.use("/products", productsRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/categories", categoriesRouter.router);
server.use("/users", userRouter.router);
server.use("/auth", authRouter.router);
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("data base connected");
}

server.get("/", (req, res) => {
  res.send({ status: 404 });
});

server.listen(8080, () => {
  console.log("sarver is started");
});
