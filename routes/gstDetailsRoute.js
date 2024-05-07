const gstRoutes = require('../controllers/gstDetailsController');
const express = require('express');
const router = express.Router();
router.post('/gstUser',gstRoutes.gstUser);
router.post('/gstFiling',gstRoutes.gstFiling);
module.exports = router;