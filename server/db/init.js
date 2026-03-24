const fs = require('fs');
const path = require('path');
const db = require('./connection');

const initDB = async () => {
    try {
        const setupSqlPath = path.join(__dirname, 'setup.sql');
        const sql = fs.readFileSync(setupSqlPath, 'utf8');

        console.log('Connecting to Postgres and initializing database...');
        await db.query(sql);
        console.log('Database initialized successfully: Table `products` created!');
    } catch (err) {
        console.error('Failed to initialize database:', err);
    } finally {
        process.exit(0);
    }
};

initDB();
