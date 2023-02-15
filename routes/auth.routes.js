const router = require("express").Router();


router.get('/signup', async (req, res) => {
    res.render("auth/signup")
})

module.exports = router;
