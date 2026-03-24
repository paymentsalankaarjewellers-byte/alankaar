const db = require('./connection');

const migrate = async () => {
    try {
        console.log('Running migration: Adding stock_quantity column...');
        await db.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;');
        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit(0);
    }
};

migrate();
