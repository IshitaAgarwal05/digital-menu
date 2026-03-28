const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const xlsx = require('xlsx');
const Product = require('./models/Product');
require('dotenv').config();

const EXCEL_PATH = path.join(__dirname, '../Digital_Menu.xlsx');
const DOWNLOAD_DIR = path.join(__dirname, '../frontend/public/assets/products');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const downloadAndConvert = async (url, destPath) => {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000
        });

        // Convert to WebP using sharp
        await sharp(response.data)
            .resize({ width: 800, withoutEnlargement: true }) // Optimize size
            .webp({ quality: 75 })
            .toFile(destPath);

        return true;
    } catch (err) {
        throw new Error(`Failed: ${err.message}`);
    }
};

const processImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital_menu');

        const workbook = xlsx.readFile(EXCEL_PATH);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = xlsx.utils.sheet_to_json(sheet);

        const products = await Product.find({});
        console.log(`Processing ${products.length} products...`);

        for (const product of products) {
            // Find corresponding item in Excel using corrected keys: "Name" and "ImageURL"
            const excelItem = excelData.find(item => {
                const nameInExcel = (item['Name'] || item[' Name'] || '').toString().trim().toLowerCase();
                const nameInDB = product.name.trim().toLowerCase();
                return nameInExcel === nameInDB;
            });

            const sourceUrl = excelItem ? (excelItem['ImageURL'] || excelItem[' ImageURL'] || excelItem['Image URL']) : null;

            if (!sourceUrl || !sourceUrl.startsWith('http')) {
                console.log(`[SKIP] No valid source URL for : ${product.name}`);
                continue;
            }

            const filename = `${product._id}.webp`;
            const dest = path.join(DOWNLOAD_DIR, filename);
            const publicPath = `/assets/products/${filename}`;

            // Re-download even if exists to ensure WebP and quality
            try {
                process.stdout.write(`[WAIT] Processing: ${product.name}... `);
                await downloadAndConvert(sourceUrl, dest);
                product.image = publicPath;
                await product.save();
                process.stdout.write(`[OK]\n`);
            } catch (err) {
                process.stdout.write(`[FAIL: ${err.message.substring(0, 20)}]\n`);
                // Reset to source URL if local fails, so site isn't broken
                if (product.image.startsWith('/assets/')) {
                    product.image = sourceUrl;
                    await product.save();
                }
            }
        }

        console.log('Restoration and WebP optimization complete! 🍦🚀');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

processImages();
