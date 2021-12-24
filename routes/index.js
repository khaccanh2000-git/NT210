const express = require("express");
const router = express.Router();
const productModel = require("../models/product.model");

router.get("/", async (req, res) => {
  const products = await productModel.find();
  res.render("index", { products: products });
});

router.get("/search", async (req, res) => {
  const search_name = req.query.name;
  if (search_name !== "") {
    const products = await productModel.find({
      name: { $regex: search_name, $options: "i" },
    });
    const result = products.filter((product) => {
      return (
        product.name.toLowerCase().indexOf(search_name.toLowerCase()) !== -1
      );
    });
    res.render("products/search", { products: result });
  } else {
    const products = await productModel.find();
    res.render("index", { products: products });
  }
});

module.exports = router;
