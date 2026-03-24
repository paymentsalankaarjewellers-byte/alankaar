const db = require('../db/connection');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Initialize tables for categories and settings
// Initialize tables for categories and settings
const initTables = async () => {
    // Categories table with optional image_url
    await db.query(`
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Migration: Add image_url if it doesn't exist (for existing tables)
    try {
        await db.query("ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT");
    } catch (err) {}

    await db.query(`
        CREATE TABLE IF NOT EXISTS subcategories (
            id SERIAL PRIMARY KEY,
            category_name VARCHAR(100) REFERENCES categories(name) ON DELETE CASCADE,
            name VARCHAR(100) NOT NULL,
            UNIQUE(category_name, name)
        );
    `);

    console.log("Database tables initialized successfully");
    
    // Migration: Add new columns to products table if they don't exist
    try {
        console.log("Checking for product table migrations...");
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100)");
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS design VARCHAR(100)");
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS jewel_type VARCHAR(100)");
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS style VARCHAR(100)");
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS occasions VARCHAR(100)");
        await db.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS color VARCHAR(100)");
        console.log("Product table migrations completed");
    } catch (err) {
        console.error("Migration error for products table:", err);
    }

    await db.query(`
        CREATE TABLE IF NOT EXISTS admins (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Seed default admin if empty
    try {
        const { rows: adminRows } = await db.query('SELECT COUNT(*) FROM admins');
        if (parseInt(adminRows[0].count) === 0) {
            const bcrypt = require('bcryptjs');
            const hashed = await bcrypt.hash('admin123', 10);
            await db.query('INSERT INTO admins (username, password) VALUES ($1, $2)', ['admin', hashed]);
            console.log("Default admin account created: admin / admin123");
        }
    } catch (err) {
        console.error("Error seeding admin:", err);
    }

    await db.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
            key VARCHAR(100) PRIMARY KEY,
            value TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS filter_options (
            id SERIAL PRIMARY KEY,
            filter_type VARCHAR(100) NOT NULL,
            name VARCHAR(100) NOT NULL,
            UNIQUE(filter_type, name)
        );
    `);

    // Coupons Table
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
    
    // Orders tables
    await db.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            customer_name VARCHAR(255) NOT NULL,
            customer_phone VARCHAR(20) NOT NULL,
            customer_email VARCHAR(255),
            customer_city VARCHAR(100),
            customer_pincode VARCHAR(20),
            customer_state VARCHAR(100),
            customer_address TEXT,
            total_amount DECIMAL(10, 2) NOT NULL,
            coupon_code VARCHAR(50),
            discount_amount DECIMAL(10, 2) DEFAULT 0,
            delivery_charge DECIMAL(10, 2) DEFAULT 0,
            status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    
    // Migration: Add new columns to orders table if they don't exist
    try {
        await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50)");
        await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0");
        await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_charge DECIMAL(10, 2) DEFAULT 0");
    } catch (err) {}

    await db.query(`
        CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
            product_id INTEGER,
            product_name VARCHAR(255) NOT NULL,
            product_image_url TEXT,
            quantity INTEGER NOT NULL,
            price DECIMAL(10, 2)
        );
    `);

    // Seed default categories if empty
    const { rows } = await db.query('SELECT COUNT(*) FROM categories');
    if (parseInt(rows[0].count) === 0) {
        const defaults = ['Necklace', 'Earrings', 'Bangles', 'Vaddanams', 'Other accessories', 'Premium bridal'];
        for (const name of defaults) {
            await db.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
        }
    }
};

// Call init on startup
initTables().catch(console.error);

// GET all categories
const getAllCategories = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST create category (supports image)
const createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required' });
    
    try {
        let imageUrl = null;
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'alankaar-categories', resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
            imageUrl = uploadResult.secure_url;
        }

        const { rows } = await db.query(
            'INSERT INTO categories (name, image_url) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING RETURNING *',
            [name.trim(), imageUrl]
        );
        if (rows.length === 0) return res.status(409).json({ error: 'Category already exists' });
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT update category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    try {
        let updateQuery = 'UPDATE categories SET name = $1';
        let params = [name?.trim()];
        
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'alankaar-categories' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
            const image_url = uploadResult.secure_url;
            updateQuery += ', image_url = $2 WHERE id = $3 RETURNING *';
            params.push(image_url, id);
        } else {
            updateQuery += ' WHERE id = $2 RETURNING *';
            params.push(id);
        }

        const { rows } = await db.query(updateQuery, params);
        if (rows.length === 0) return res.status(404).json({ error: 'Category not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE category
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM categories WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- SUBCATEGORIES ---

// GET subcategories for a category
const getSubcategories = async (req, res) => {
    const { category_name } = req.params;
    try {
        const { rows } = await db.query('SELECT * FROM subcategories WHERE category_name = $1 ORDER BY name ASC', [category_name]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST create subcategory
const createSubcategory = async (req, res) => {
    const { category_name } = req.params;
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Subcategory name is required' });
    
    try {
        const { rows } = await db.query(
            'INSERT INTO subcategories (category_name, name) VALUES ($1, $2) ON CONFLICT (category_name, name) DO NOTHING RETURNING *',
            [category_name, name.trim()]
        );
        if (rows.length === 0) return res.status(409).json({ error: 'Subcategory already exists' });
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE subcategory
const deleteSubcategory = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM subcategories WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- SETTINGS ---

// GET a specific setting
const getSetting = async (req, res) => {
    const { key } = req.params;
    try {
        const { rows } = await db.query('SELECT value FROM site_settings WHERE key = $1', [key]);
        res.json({ key, value: rows[0]?.value || null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST/PUT a setting (e.g. hero_image_url)
const upsertSetting = async (req, res) => {
    const { key } = req.params;
    try {
        let value;

        if (req.file) {
            // Upload image to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'alankaar-settings', resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
            value = uploadResult.secure_url;
        } else {
            value = req.body.value;
        }

        await db.query(
            `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, NOW())
             ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
            [key, value]
        );
        res.json({ key, value });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET all filter options
const getFilterOptions = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM filter_options ORDER BY filter_type ASC, name ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST create filter option
const createFilterOption = async (req, res) => {
    const { filter_type, name } = req.body;
    if (!filter_type || !name || !name.trim()) return res.status(400).json({ error: 'Filter type and name are required' });
    
    try {
        const { rows } = await db.query(
            'INSERT INTO filter_options (filter_type, name) VALUES ($1, $2) ON CONFLICT (filter_type, name) DO NOTHING RETURNING *',
            [filter_type.trim(), name.trim()]
        );
        if (rows.length === 0) return res.status(409).json({ error: 'Filter option already exists' });
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE filter option
const deleteFilterOption = async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await db.query('DELETE FROM filter_options WHERE id = $1', [id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Filter option not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================== COUPONS API ====================

const getCoupons = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM coupons ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
};

const createCoupon = async (req, res) => {
    const { code, discount_type, discount_value, min_cart_value } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO coupons (code, discount_type, discount_value, min_cart_value) VALUES ($1, $2, $3, $4) RETURNING *',
            [code.toUpperCase(), discount_type, discount_value, min_cart_value || 0]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: 'Coupon code already exists' });
        res.status(500).json({ error: 'Failed to create coupon' });
    }
};

const toggleCouponStatus = async (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;
    try {
        const { rows } = await db.query(
            'UPDATE coupons SET is_active = $1 WHERE id = $2 RETURNING *',
            [is_active, id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Coupon not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update coupon status' });
    }
};

const deleteCoupon = async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await db.query('DELETE FROM coupons WHERE id = $1', [id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Coupon not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete coupon' });
    }
};

const validateCoupon = async (req, res) => {
    const { code, cartTotal } = req.body;
    try {
        const { rows } = await db.query('SELECT * FROM coupons WHERE code = $1', [code.toUpperCase()]);
        
        if (rows.length === 0) return res.status(404).json({ error: 'Invalid coupon code' });
        
        const coupon = rows[0];
        if (!coupon.is_active) return res.status(400).json({ error: 'This coupon is no longer active' });
        
        if (parseFloat(cartTotal) < parseFloat(coupon.min_cart_value)) {
            return res.status(400).json({ error: `Minimum cart value of ₹${coupon.min_cart_value} required` });
        }

        res.json(coupon);
    } catch (err) {
        res.status(500).json({ error: 'Failed to validate coupon' });
    }
};

// Initialize on load
initTables().catch(console.error);

module.exports = { 
    getAllCategories, createCategory, updateCategory, deleteCategory, 
    getSubcategories, createSubcategory, deleteSubcategory,
    getSetting, upsertSetting,
    getFilterOptions, createFilterOption, deleteFilterOption,
    getCoupons, createCoupon, toggleCouponStatus, deleteCoupon, validateCoupon,
    initTables
};
