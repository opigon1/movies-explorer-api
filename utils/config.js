const { NODE_ENV, JWT_SECRET, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

module.exports = { NODE_ENV, JWT_SECRET, DB_URL };
