const router = require('express').Router();
const { signupValidation } = require('../utils/validation');
const { createUser } = require('../controllers/users');

router.post('/', signupValidation, createUser);

module.exports = router;
