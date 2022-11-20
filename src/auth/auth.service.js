const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const Customer = require("../customer/customer.model");
const config = process.env;


const signin = async (req, res, _) =>{
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    let customer = await Customer.findOne({email: req.body.email, password: encryptedPassword});
    if(!customer){
        return res.status(401).json({status: "error", message: "Login Failed"});
    }
    // Create token
    customer.token = jwt.sign(
        {xid: customer._id, email: customer.email},
        process.env.TOKEN_KEY,
        {
            expiresIn: "1h",
        }
    );
    return { xid: customer._id, token: customer.token };
}

const register = async (req, res, next) => {
    const {firstName, lastName, displayName, email, password} = req.body;

    // Validate user input
    if (!(email && password && firstName && lastName && displayName)) {
        return {status: "error", message: "All input is required"};
    }

    // check if user already exist
    const oldUser = await Customer.findOne({email: email});
    console.log(email, oldUser);

    if (oldUser) {
        return res.status(409).json({status: "error", message:"User Already Exist. Please Login"})
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    let customer;
    try {
        customer = await Customer.create({
            firstName,
            lastName,
            displayName,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        // save user token
        customer.token = jwt.sign(
            {xid: customer._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h",
            }
        );
    } catch (e) {
        return {status: "error", message: e.message};
    }


    return { xid: customer._id, token: customer.token };
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
    signin,
    verifyToken
}

module.exports = authService