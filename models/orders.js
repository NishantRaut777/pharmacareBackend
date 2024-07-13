const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    items: [{
        productId: {
            type: String
        },
        name: String,
        imagesrc: String,
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity can not be less then 1.']
        },
        price: Number
    }],
    bill: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    CardNumber: {
        type: Number,
        required: true
    },
    date_added: {
        type: Date,
        default: Date.now
    }
},  {timestamps: true});

const orderModel = mongoose.model("order", ordersSchema);

module.exports = orderModel;