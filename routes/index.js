const express = require('express');
const router = express.Router();
const controllerIndex = require('../controllers/index');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


/**
 * @swagger
 *  /status:
 *  get:
 *    description: Shows API status
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/status', controllerIndex.getStatus);

module.exports = router;
