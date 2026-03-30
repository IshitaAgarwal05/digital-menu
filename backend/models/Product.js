const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    image: { type: String, required: true },
    bestseller: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    volume: { type: String },
    discount: { type: Number, default: 0 },
    launchingyear: { type: Date },
}, { timestamps: true });

productSchema.index({ name: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
