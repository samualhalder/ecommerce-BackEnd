const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.fetchAllProducts = async (req, res) => {
  let query = Product.find({});
  let totalDocsQuery = Product.find({});
  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalDocsQuery = totalDocsQuery.find({ category: req.query.category });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalDocsQuery = totalDocsQuery.find({ brand: req.query.brand });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalDocsQuery = totalDocsQuery.sort({
      [req.query._sort]: req.query._order,
    });
  }
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
    totalDocsQuery = totalDocsQuery.skip(pageSize * (page - 1)).limit(pageSize);
  }
  const totalDocs = await totalDocsQuery.count().exec();
  console.log({ totalDocs });
  try {
    const doc = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json(error);
  }
};
