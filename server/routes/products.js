const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Accept up to 10 images with field name "images"
router.post('/', authMiddleware, upload.array('images', 10), productController.createProduct);
router.put('/:id', authMiddleware, upload.array('images', 10), productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

// Delete a specific product gallery image
router.delete('/images/:imageId', authMiddleware, productController.deleteProductImage);

module.exports = router;
