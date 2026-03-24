const db = require('./server/db/connection');

async function migrate() {
    console.log("Starting manual migration...");
    try {
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100)");
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS design VARCHAR(100)");
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS jewel_type VARCHAR(100)");
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS style VARCHAR(100)");
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS occasions VARCHAR(100)");
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS color VARCHAR(100)");
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS coupons (
                id SERIAL PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                discount_type VARCHAR(20) DEFAULT 'flat',
                discount_value DECIMAL(10,2) NOT NULL,
                min_cart_value DECIMAL(10,2) DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50)");
        await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0");
        await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_charge DECIMAL(10, 2) DEFAULT 0");

        console.log("Migration successful!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        process.exit(0);
    }
}

migrate();
