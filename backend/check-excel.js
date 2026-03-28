const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../Digital_Menu.xlsx');
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet);

console.log('Columns found:', Object.keys(data[0]));
console.log('Sample row:', data[0]);
