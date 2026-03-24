const db = require('../db/connection');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Init product_images table
const initProductImagesTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS product_images (
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
            image_url TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};
initProductImagesTable().catch(console.error);

// Upload a single file buffer to Cloudinary
const uploadBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'alankaar_products' },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// Upload multiple files → returns array of secure_urls
const uploadMultiple = async (files) => {
    const results = await Promise.all(files.map(f => uploadBuffer(f.buffer)));
    return results.map(r => r.secure_url);
};

// Fetch extra images for a product
const getProductImages = async (productId) => {
    const { rows } = await db.query(
        'SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC',
        [productId]
    );
    return rows;
};

exports.getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = 'SELECT * FROM products';
        let params = [];

        if (category && category !== 'All') {
            query += ' WHERE category ILIKE $1';
            params.push(category);
        }

        query += ' ORDER BY created_at DESC';
        
        const { rows } = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error("Error in getAllProducts:", err);
        res.status(500).json({ error: 'Failed to fetch products', message: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });

        const product = rows[0];
        const images = await getProductImages(id);
        product.images = images; // attach gallery images array

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, category, subcategory, price, description, stock_quantity, design, jewel_type, style, occasions, color } = req.body;
        const files = req.files || [];

        let image_url = null;
        const extraImages = [];

        if (files.length > 0) {
            const urls = await uploadMultiple(files);
            image_url = urls[0];           // first image = primary
            extraImages.push(...urls.slice(1)); // rest go to product_images
        }

        const { rows } = await db.query(
            'INSERT INTO products (name, category, subcategory, price, description, image_url, stock_quantity, design, jewel_type, style, occasions, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
            [name, category, subcategory || null, price || null, description, image_url, stock_quantity || 0, design || null, jewel_type || null, style || null, occasions || null, color || null]
        );

        const productId = rows[0].id;

        // Store extra images
        for (let i = 0; i < extraImages.length; i++) {
            await db.query(
                'INSERT INTO product_images (product_id, image_url, sort_order) VALUES ($1, $2, $3)',
                [productId, extraImages[i], i + 1]
            );
        }

        res.status(201).json({ ...rows[0], images: extraImages.map((url, i) => ({ image_url: url, sort_order: i + 1 })) });
    } catch (err) {
        console.error("Error in createProduct:", err);
        res.status(500).json({ error: 'Failed to create product', message: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, subcategory, price, description, stock_quantity, design, jewel_type, style, occasions, color } = req.body;
        const files = req.files || [];

        const existing = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        if (existing.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

        let image_url = existing.rows[0].image_url;

        if (files.length > 0) {
            const urls = await uploadMultiple(files);
            image_url = urls[0];

            // Append extra images (don't delete old ones — let admin manage)
            for (let i = 1; i < urls.length; i++) {
                await db.query(
                    'INSERT INTO product_images (product_id, image_url, sort_order) VALUES ($1, $2, (SELECT COALESCE(MAX(sort_order),0)+1 FROM product_images WHERE product_id=$1))',
                    [id, urls[i]]
                );
            }
        }

        const { rows } = await db.query(
            'UPDATE products SET name=$1, category=$2, subcategory=$3, price=$4, description=$5, image_url=$6, stock_quantity=$7, design=$8, jewel_type=$9, style=$10, occasions=$11, color=$12 WHERE id=$13 RETURNING *',
            [name, category, subcategory || null, price || null, description, image_url, stock_quantity || 0, design || null, jewel_type || null, style || null, occasions || null, color || null, id]
        );

        const images = await getProductImages(id);
        res.json({ ...rows[0], images });
    } catch (err) {
        console.error("Error in updateProduct:", err);
        res.status(500).json({ error: 'Failed to update product', message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // CASCADE delete on product_images due to FK constraint
        const { rows } = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully', id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

// DELETE a specific product image
exports.deleteProductImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        await db.query('DELETE FROM product_images WHERE id = $1', [imageId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete image' });
    }
};
