const db = require('../db/connection');

const createOrder = async (req, res) => {
    const { customerDetails, items, totalAmount, couponCode, discountAmount, deliveryCharge } = req.body;
    
    if (!customerDetails || !items || !items.length) {
        return res.status(400).json({ error: 'Missing order details or items' });
    }

    const client = await db.pool.connect();
    
    try {
        await client.query('BEGIN');

        // Insert into orders table
        const orderResult = await client.query(
            `INSERT INTO orders 
             (customer_name, customer_phone, customer_email, customer_city, customer_pincode, customer_state, customer_address, total_amount, coupon_code, discount_amount, delivery_charge) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
            [
                customerDetails.name, customerDetails.phone, customerDetails.email,
                customerDetails.city, customerDetails.pincode, customerDetails.state,
                customerDetails.address, totalAmount || 0,
                couponCode || null, discountAmount || 0, deliveryCharge || 0
            ]
        );
        
        const orderId = orderResult.rows[0].id;

        // Insert into order_items table
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, product_name, product_image_url, quantity, price)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [orderId, item.id || null, item.name, item.image_url || null, item.quantity || 1, item.price || 0]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, orderId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Failed to create order' });
    } finally {
        client.release();
    }
};

// Get all orders (with latest first + joined items)
const getAllOrders = async (req, res) => {
    try {
        const { rows: orders } = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
        const { rows: items } = await db.query('SELECT * FROM order_items');
        
        const ordersWithItems = orders.map(order => ({
            ...order,
            items: items.filter(i => i.order_id === order.id)
        }));

        res.json(ordersWithItems);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) return res.status(400).json({ error: 'Status is required' });
    
    try {
        const { rows } = await db.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
        
        res.json(rows[0]);
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: 'Failed to update order' });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    updateOrderStatus
};
