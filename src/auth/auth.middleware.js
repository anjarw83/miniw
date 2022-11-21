const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {

        return res.status(403).json({status: "error", message: "Token is required for authentication"});
    }
    try {
        const value = token.split(" ")[1];
        req.user = jwt.verify(value, config.TOKEN_KEY);
    } catch (err) {
        return res.status(401).json("Invalid Token");
    }
    return next();
}

const decodeToken = (req, res) => {
    const token = req.headers["authorization"];
    let decodedToken ;

    if (!token) {
        return res.status(403).json({status: "error", message: "Token is required for authentication"});
    }
    try {
        const value = token.split(" ")[1];
        decodedToken = jwt.decode(value, config.TOKEN_KEY);
    } catch (err) {
        return res.status(401).json({status: "error", message: "Invalid Token"});
    }
    return decodedToken;
}

module.exports = {
    verifyToken,
    decodeToken
};
