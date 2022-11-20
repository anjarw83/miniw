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

router.post("/enable", auth.verifyToken, async(req, res) =>{
    const { xid } = auth.decodeToken(req);

    const wallet = await Wallet.findOneAndUpdate({customerId: xid},
        {enabled: true}, {returnOriginal: false});
    res.status(200).json({status: "success", data: {customerId: wallet.customerId, enabled: wallet.enabled} });
});

router.patch("/disable", auth.verifyToken, async(req, res) =>{
    const { xid } = auth.decodeToken(req);

    const wallet = await Wallet.findOneAndUpdate({customerId: xid},
        {enabled: false}, {returnOriginal: false});
    res.status(200).json({status: "success", data: {customerId: wallet.customerId, enabled: wallet.enabled} });
});

router.get("/balance", auth.verifyToken, async (req, res) => {
    const { xid } = auth.decodeToken(req);

    const wallet = await Wallet.findOne({
        customerId: xid, enabled: true
    })
    if( !wallet) {
        return res.status(404).json({status: "error", message: "Invalid Wallet Balance"});
    }
    const result = { status: "success", body: { customerId: xid, balance: wallet.balance }};

    res.status(200).json(result);
});

router.post("/deposits", urlEncoded, auth.verifyToken, async(req,res) =>{
    const { xid } = auth.decodeToken(req);
    const amount = req.body.amount;

    if( amount < 0 ){
        return res.status(400).json({status: "error", message: "Amount must larger than zero"})
    }
    const wallet = await Wallet.findOne({
        customerId: xid, enabled: true
    })
    if( !wallet) {
        return res.status(404).json({status: "error", message: "Invalid Wallet Balance"});
    }
    const result = await Wallet.findOneAndUpdate({customerId: xid}, {
        $inc: { balance: amount }
    }, {returnOriginal: false});

    res.status(200).json({status: "success", body: { customerId: result.customerId, balance: result.balance}});
})

router.post("/withdrawals", urlEncoded, auth.verifyToken, async(req,res) =>{
    const { xid } = auth.decodeToken(req);
    const amount = req.body.amount;

    if( amount < 0 ){
        return res.status(400).json({status: "error", message: "Amount must larger than zero"})
    }
    const wallet = await Wallet.findOne({
        customerId: xid, enabled: true
    })
    if( !wallet) {
        return res.status(404).json({status: "error", message: "Invalid Wallet Balance"});
    }
    if ( wallet.balance < amount ){
        return res.status(400).json({status: "error", message: "Insufficient Funds"});
    }
    const result = await Wallet.findOneAndUpdate({customerId: xid}, {
        $inc: { balance: -amount }
    }, { returnOriginal: false});

    res.status(200).json({status: "success", body: { customerId: result.customerId, balance: result.balance}});
})

module.exports = router