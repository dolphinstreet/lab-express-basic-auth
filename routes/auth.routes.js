const router = require("express").Router();
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')



router.get('/signup', async (req, res) => {
    res.render("auth/signup")
})

router.post("/signup", async (req, res, next) => {
    try {
        const actualUsername = req.body.username;
        const actualPassword = req.body.password;
        if (!actualUsername) {
            return res.render("auth/signup", { errorUsername: "Don't forget the username !", password: actualPassword })
        }
        if (!actualPassword) {
            return res.render("auth/signup", { errorPassword: "Don't forget the password !", username: actualUsername })
        }
        if (actualPassword.length < 8) {
            return res.render("auth/signup", { errorPassword: "The password must be at least 8 characters long !", username: actualUsername, password: actualPassword })
        }
        if (!actualPassword.match(/(?=.*[A-Z])/g)) {
            return res.render("auth/signup", { errorPassword: "You must include at least one uppercase letter !", username: actualUsername, password: actualPassword })
        }
        if (!actualPassword.match(/(?=.*[a-z])/g)) {
            return res.render("auth/signup", { errorPassword: "You must include at least one lowercase letter !", username: actualUsername, password: actualPassword })
        }
        if (!actualPassword.match(/(?=.*[1-9])/g)) {
            return res.render("auth/signup", { errorPassword: "You must include at least one number !", username: actualUsername, password: actualPassword })
        }
        const alreaydAnUser = await User.findOne({ username: actualUsername })
        if (alreaydAnUser) {
            return res.render("auth/signup", { errorUsername: "This username is already taken", password: actualUsername })
        }

        //Let's hash the password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(actualPassword, salt)
        const userToCreate = {
            username: actualUsername,
            password: hashedPassword,
        }
        //Add the user to the database
        const userFromDb = await User.create(userToCreate)

        res.redirect("login")
    } catch (error) {
        next(error)
    }

})


router.get("/login", (req, res) => {
    res.render("auth/login")
})

router.post("/login", async (req, res, next) => {
    try {
        const actualUsername = req.body.username;
        const actualPassword = req.body.password;
        if (!actualUsername) {
            return res.render("auth/login", { errorUsername: "Don't forget the username !", password: actualPassword })
        }
        if (!actualPassword) {
            return res.render("auth/login", { errorPassword: "Don't forget the password !", username: actualUsername })
        }
        //Check if we have this username in the database
        const userInDb = await User.findOne(
            { username: actualUsername }, //find
            { username: 1, password: 1 } //projection
        )
        if (!userInDb) {
            return res.render("auth/login", { error: "You never registered with this username !" })
        }
        // Check if it's the right password
        const samePasswords = await bcrypt.compare(actualPassword, userInDb.password)

        if (!samePasswords) {
            return res.render("auth/login", { error: "The username or/and the email are wrong !" })
        }
        //set the user to be the session user
        req.session.currentUser = userInDb;
        res.redirect("profile")
    } catch (error) {
        next(error)
    }

})


router.get('/logout', (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next(error)
        }
        res.redirect('/login')
    })
})



module.exports = router;
