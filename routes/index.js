const router = require('express').Router();

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use(require('../middlewares/auth'));
router.use('/movies', require('./movies'));
router.use('/users', require('./users'));
router.use('/signout', require('./signout'));
router.use('*', require('./notFound'));

module.exports = router;
