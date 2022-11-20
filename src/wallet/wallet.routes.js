const express = require("express");
const router = express.Router();
const auth = require("../auth/auth.middleware");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlEncoded = bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
});
const walletRepository = require("../wallet/wallet.repository");
const Wallet = require("../wallet/wallet.model");
const authService = require("../auth/auth.service");

router.post("/register", jsonParser, async (req, res) =>{

    const result = await authService.register(req, res);
    if (result.status === "error") {
        return res.status(409).json({status: result.status, message: result.message});
    }
    res.status(200).json({status: "success", data: result })
});

router.post("/init", urlEncoded, auth.verifyToken, async(req, res) =>{
    const customerId = req.body.customer_xid;
    if(!customerId){
        return res.status(400).json({status: "error", message: "field xid required"});
    }

    let wallet = await Wallet.findOne({customerId});
    if(wallet){
        return res.status(409).json({status: "error", message: "Wallet Already Initialized"});
    }

    await walletRepository.create({customerId})
    res.status(201).json({status: "success", message: "Wallet Successfully Initialized"});
});

router.get("/balance", jsonParser, auth.verifyToken, async (req, res) => {
    const result = { status: "success", body: {}}

    res.status(200).json({ data: result });
});

module.exports = router