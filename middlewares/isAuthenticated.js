
//Check if a user is logged in or redirect to login page
function isAuthenticated(req, res, next) {
    if (req.session.currentUser) {
        res.locals.currentUser = req.session.currentUser;
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports = isAuthenticated;