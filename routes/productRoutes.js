const express = require("express");
const { getProductsController, addProductController, updateProductController, deleteProductController, getProductsByQuery, getProductById, getProductsByName, getProductFilters, getFilteredProducts } = require("../controllers/productController");
const router = express.Router();

router.post("/addproduct", addProductController);
router.get("/getproducts", getProductsController);

// GET Products by query
router.get("/get", getProductsByQuery);

router.get("/:id", getProductById);

// router.get("/searchProduct/:productName", getProductsByName);
router.get("/search/searchedProduct", getProductsByName);
router.get("/searchfilters/getProductFilters",getProductFilters );
router.post("/search/filteredProduct", getFilteredProducts);

router.put("/updateproduct/:id", updateProductController);
router.delete("/deleteProduct/:id", deleteProductController);

module.exports = router;