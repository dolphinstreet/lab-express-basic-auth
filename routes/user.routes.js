
const router = require('express').Router()
const isAuthenticated = require('./../middlewares/isAuthenticated')

router.get("/profile", isAuthenticated, (req, res, next) => {
    res.render("profile/profile")
})

router.get("/main", isAuthenticated, (req, res, next) => {
    res.render("main")
})

router.get("/private", isAuthenticated, (req, res, next) => {
    res.render("private")
})



module.exports = router
