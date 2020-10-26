const router = require('express').Router();
const auth = require('./middleware/token');

// this is for register a new token, this endpoint is private
router.get('/', auth.bringingAllkeys);

router.post('/register', auth.createToken);

router.delete('/', auth.deleteToken);

module.exports = router;
