const { Brand } = require("../model/Brand");

exports.fetchBrands = async (req, res) => {
  try {
    const Brands = await Brand.find({}).exec();
    res.status(201).json(Brands);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.createBrand = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const docs = await brand.save();
    res.status(201).json(docs);
  } catch (error) {
    res.status(400).json(error);
  }
};
