const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/address').post(protect, addAddress);
router.route('/address/:id').put(protect, updateAddress).delete(protect, deleteAddress);

module.exports = router;
