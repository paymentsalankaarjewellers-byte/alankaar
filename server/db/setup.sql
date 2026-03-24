CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    price DECIMAL(10, 2),
    weight VARCHAR(50),
    description TEXT,
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0,
    design VARCHAR(100),
    jewel_type VARCHAR(100),
    style VARCHAR(100),
    occasions VARCHAR(100),
    color VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
