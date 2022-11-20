const express = require("express");
const router = express.Router();
const auth = require("../auth/auth.middleware");
const authService = require("../auth/auth.service");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.post("/register", jsonParser, async (req, res) =>{

    const result = await authService.register(req, res);
    if (result.status === "error") {
        res.status(409).json({status: result.status, message: result.message});
    }
    res.status(200).json({status: "success", data: result })
});

router.get("/balance", jsonParser, auth.verifyToken, async (req, res) => {
    const result = { status: "success", body: {}}

    res.status(200).json({ data: result });
});

module.exports = router