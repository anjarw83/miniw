const jwt = require("jsonwebtoken");
const Customer = require("../customer/customer.model");
const bcrypt = require("bcryptjs")
const config = process.env;

const sign = (email, password) =>{

}

const register = async (req, res, next) => {
    const {firstName, lastName, displayName, email, password} = req.body;

    // Validate user input
    if (!(email && password && firstName && lastName && displayName)) {
        return {status: "error", message: "All input is required"};
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await Customer.findOne({email: email});
    console.log(email, oldUser);

    if (oldUser) {
        return res.status(409).json({status: "error", message:"User Already Exist. Please Login"})
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    let user;
    try {
        user = await Customer.create({
            firstName,
            lastName,
            displayName,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;
    } catch (e) {
        return {status: "error", message: e.message};
    }


    return user;
}

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

authService = {
    register,
    sign,
    verifyToken
}

module.exports = authService