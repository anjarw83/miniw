const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {

        return res.status(403).json({status: "error", message: "Token is required for authentication"});
    }
    try {
        const value = token.split(" ")[1];
        const decoded = jwt.verify(value, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}

module.exports = {
    verifyToken
    // // if user is authenticated the redirected to next page else redirect to login page
    // ensureAuth: function(req, res, next) {
    //     if (req.isAuthenticated()) {
    //         return next();
    //     } else {
    //         res.redirect("/");
    //     }
    // },
    // // if user is authenticated and going to login page then redirected to home page if not authenticated redirected to login page  .
    // ensureGuest: function(req, res, next) {
    //     if (!req.isAuthenticated()) {
    //         return next();
    //     } else {
    //         res.redirect("/hello");
    //     }
    // }
};