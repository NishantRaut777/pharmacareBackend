const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const { getCartItems, addCartItem, deleteCartItem } = require("../controllers/cartController");
const router = express.Router();

router.get("/cartItems/:id", getCartItems);
router.post("/addCartItem/:id", addCartItem);
router.delete("/deleteCartItem/:userId/:itemId", deleteCartItem);

module.exports = router;