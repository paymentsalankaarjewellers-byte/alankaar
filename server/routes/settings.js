const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    getAllCategories, createCategory, updateCategory, deleteCategory,
    getSubcategories, createSubcategory, deleteSubcategory,
    getSetting, upsertSetting,
    getFilterOptions, createFilterOption, deleteFilterOption,
    getCoupons, createCoupon, toggleCouponStatus, deleteCoupon, validateCoupon
} = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Categories
router.get('/categories', getAllCategories);
router.post('/categories', authMiddleware, upload.single('image'), createCategory);
router.put('/categories/:id', authMiddleware, upload.single('image'), updateCategory);
router.delete('/categories/:id', authMiddleware, deleteCategory);

// Subcategories
router.get('/categories/:category_name/subcategories', getSubcategories);
router.post('/categories/:category_name/subcategories', authMiddleware, createSubcategory);
router.delete('/subcategories/:id', authMiddleware, deleteSubcategory);

// Filter Options
router.get('/filters', getFilterOptions);
router.post('/filters', authMiddleware, createFilterOption);
router.delete('/filters/:id', authMiddleware, deleteFilterOption);

// Site Settings (e.g. hero image)
router.get('/settings/:key', getSetting);
router.post('/settings/:key', authMiddleware, upload.single('image'), upsertSetting);

// Coupons
router.get('/coupons', authMiddleware, getCoupons);
router.post('/coupons', authMiddleware, createCoupon);
router.put('/coupons/:id/status', authMiddleware, toggleCouponStatus);
router.delete('/coupons/:id', authMiddleware, deleteCoupon);
router.post('/validate-coupon', validateCoupon);

module.exports = router;
