const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            qty: { type: Number, required: true },
            brand: { type: String }
        }
    ],
    totalAmount: { type: Number, required: true },
    itemsSummary: { type: String },
    orderType: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
    deliveryAddress: {
        fullName: String,
        phone: String,
        house: String,
        street: String,
        landmark: String,
        city: String,
        pincode: String,
        instructions: String,
        latitude: Number,
        longitude: Number
    },
    deliveryCharge: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['placed', 'preparing', 'out_for_delivery', 'delivered', 'ready_for_pickup'],
        default: 'placed'
    },
    paymentMethod: { type: String, default: 'Cash/UPI' },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
