const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use('/', require('../routes/auth.routes'));
router.use('/', require('../routes/user.routes'));


module.exports = router;
