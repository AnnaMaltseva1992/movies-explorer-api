const { JWT_SECRET = 'JWT_SECRET' } = process.env;
const { MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { PORT = 3000 } = process.env;
const LIMITER_CONFIG = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
};

module.exports = {
  JWT_SECRET,
  MONGO_URL,
  PORT,
  LIMITER_CONFIG,
};
