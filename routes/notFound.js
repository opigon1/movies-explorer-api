const router = require('express').Router();
const { NOT_FOUND } = require('../utils/errors/NOT_FOUND');

router.use('*', (req, res, next) => next(new NOT_FOUND('Страница не найдена')));

module.exports = router;
