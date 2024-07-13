const Order = require("../models/orders");
const Cart = require("../models/cart");
const User = require("../models/userModel");
// const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const getOrders = async(req, res) => {
    try {
        const userId = req.body.userid;
        const orders = await Order.find({ userId }).sort({ date: -1 });
        const finalOrders = orders.map((order) => {
            const formattedDate = order.date_added.toISOString().slice(0, 19).replace('T', ' ');
            
            // Update the order object with the formatted date
            const updatedOrder = {
                ...order.toObject(), // Convert Mongoose document to plain JavaScript object
                date_added: formattedDate
            };
            return updatedOrder;
        })
        res.status(200).send(finalOrders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `Get Orders Controller ERROR ${error}`,
            success: false
        })
    }
};

// this getorders gets orders accroding to order date
const getOrders2 = async(req, res) => {
    try {
        const userId = req.body.userid;
        const orders = await Order.find({ userId }).sort({ date: -1 });
        const newFinalOrders = {};
        const finalOrders = orders.map((order) => {
            const formattedDate = order.date_added.toISOString().slice(0, 19).replace('T', ' ');

            if(newFinalOrders.hasOwnProperty(formattedDate)){
                newFinalOrders[formattedDate] = [
                    ...newFinalOrders[formattedDate],
                    order.items
                ]
            } else{
                newFinalOrders[formattedDate] = order.items;
            }
            
            // Update the order object with the formatted date
            // const updatedOrder = {
            //     ...order.toObject(), // Convert Mongoose document to plain JavaScript object
            //     date_added: formattedDate
            // };
            // return updatedOrder;
        })
        res.status(200).send(newFinalOrders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `Get Orders Controller ERROR ${error}`,
            success: false
        })
    }
};

const checkoutOrder = async(req,res) => {
    try {
        // const userId = req.params.id;
        const { userId, shippingAddress, CardNumber } = req.body;
        // console.log(userId);
        const cartData = await Cart.findOne({ userId });
        // console.log(cartData);

        // proceed only if there is cart available for current user.
        if(!cartData){
            res.status(404).send("There is no cart for current user");
        }
        const cartItems = cartData.items;
        const cartBill = cartData.bill;
        const orderData = {
            userId: userId,
            items: cartItems,
            bill: cartBill,
            shippingAddress: shippingAddress,
            CardNumber: CardNumber
        };

        const resInsert = await Order.create(orderData);
        if(resInsert){
            const result = await Cart.deleteOne({ userId });
            const finalData = { success: true, ...result }
            res.status(200).send(finalData);
        } else{
            res.status(404).send("Something went wrong during checkout");
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `Checkout Order Controller ERROR ${error}`,
            success: false
        })
    };
};

module.exports = { getOrders, checkoutOrder, getOrders2 };