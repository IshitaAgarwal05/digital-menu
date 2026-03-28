require('dotenv').config();
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const extractVolumeText = (name) => {
    if (!name) return '';
    const match = name.match(/(\d+\s*(ml|l|ltr|gm|g|kg))/i);
    return match ? match[0] : '';
};

const seedFromExcel = async () => {
    try {
        await connectDB();
        await Product.deleteMany({});

        const filePath = path.join(__dirname, '../Digital_Menu.xlsx');
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log(`Found ${data.length} items in Excel.`);

        const products = data.map(item => {
            // Trim keys to handle " Category" etc.
            const cleanItem = {};
            Object.keys(item).forEach(key => {
                cleanItem[key.trim().toLowerCase()] = item[key];
            });

            const price = Number(cleanItem.price) || 0;
            const mrp = Number(cleanItem.mrp) || price;
            const discount = mrp > price ? ((mrp - price) / mrp) * 100 : 0;

            return {
                name: cleanItem.name || 'Unknown Product',
                brand: cleanItem.brand || 'Other',
                category: cleanItem.category || 'General',
                price: price,
                mrp: mrp,
                image: cleanItem.imageurl || 'https://placehold.co/300x220/f4f6f9/a0a0a0?text=No+Image',
                available: String(cleanItem.available).toLowerCase() === 'yes',
                bestseller: String(cleanItem.bestseller).toLowerCase() === 'yes',
                volume: extractVolumeText(cleanItem.name),
                discount: discount
            };
        });

        await Product.insertMany(products);
        console.log(`Successfully Seeded ${products.length} Products! 🍦🚀`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedFromExcel();
