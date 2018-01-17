var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
if(req.session.user!=undefined&&req.session.user!='')
  res.render('editor');
else
	res.redirect('/');
});

module.exports = router;
