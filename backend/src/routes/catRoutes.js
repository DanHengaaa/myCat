const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');

router.get('/', catController.getAllCats);
router.post('/', catController.createCat);
router.get('/:id', catController.getCatById);

module.exports = router;