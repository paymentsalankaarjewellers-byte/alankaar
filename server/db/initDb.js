const fs = require('fs');
const path = require('path');
const db = require('./connection');
const productController = require('../controllers/productController');
const settingsController = require('../controllers/settingsController');

const initializeDatabase = async () => {
    try {
        console.log('--- Starting Database Initialization ---');

        // 1. Run setup.sql to ensure products table exists
        const setupSqlPath = path.join(__dirname, 'setup.sql');
        if (fs.existsSync(setupSqlPath)) {
            const sql = fs.readFileSync(setupSqlPath, 'utf8');
            console.log('Running setup.sql...');
            await db.query(sql);
            console.log('setup.sql executed successfully.');
        }

        // 2. Initialize settings tables (categories, orders, etc.)
        console.log('Initializing settings tables...');
        await settingsController.initTables();
        console.log('Settings tables initialized.');

        // 3. Initialize product gallery images table
        console.log('Initializing product images table...');
        await productController.initProductImagesTable();
        console.log('Product images table initialized.');

        console.log('--- Database Initialization Complete ---');
    } catch (err) {
        console.error('Database initialization failed:', err);
        // We don't exit process here because we want the server to potentially handle it or log it
        throw err;
    }
};

module.exports = initializeDatabase;
