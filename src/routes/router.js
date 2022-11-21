const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const authService = require("../auth/auth.service");

router.get("/", (req, res) => {
    res.status(200).json({status:"success", message:"OK"});
});

router.get("/hello", async (req, res) => {
    res.status(200).json({message: "OK"})
});

router.post("/v1/signin", jsonParser, async (req, res) => {
    const { email, password } = req.body;
    if(!(email && password)){
        return res.status(400).json({status: "error", message:"Email & password Required"});
    }
    const result = await authService.signin(req, res);
    if(result.status === "error"){
        return res.status(401).json({status: result.status, message: result.message});
    }
    res.status(200).json({status: "success", data: result});
});

router.post("/v1/register", jsonParser, async (req, res) =>{

    const result = await authService.register(req, res);
    if (result.status === "error") {
        return res.status(409).json({status: result.status, message: result.message});
    }
    res.status(200).json({status: "success", data: result })
});



module.exports = router;
