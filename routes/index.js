var express = require('express'),
    User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '설문조사' });
});

router.get('/signin', function(req, res, next) {
  res.render('signin');
});

module.exports = router;
