const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });
const db = require('./server/db/connection');

async function run() {
    try {
        console.log('Updating product 1 (chain) to category "chains"...');
        const res1 = await db.query("UPDATE products SET category = 'chains' WHERE name ILIKE '%chain%'");
        console.log('Updated chains:', res1.rowCount);

        console.log('Updating product 2 (ring) to category "bangles" (for testing)...');
        const res2 = await db.query("UPDATE products SET category = 'bangles' WHERE name ILIKE '%ring%'");
        console.log('Updated bangles:', res2.rowCount);

        console.log('Ensuring categories exist in the categories table...');
        await db.query("INSERT INTO categories (name) VALUES ('chains'), ('bangles'), ('Rings') ON CONFLICT DO NOTHING");
        
        console.log('Data alignment complete.');
    } catch (err) {
        console.error('FAILED TO ALIGN DATA:', err);
    } finally {
        process.exit(0);
    }
}

run();
