const router = require('express').Router();
const { updateUserValidation } = require('../utils/validation');
const { getUserinfo, updateUser } = require('../controllers/users');

router.get('/me', getUserinfo);
router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
