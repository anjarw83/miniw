const express = require("express");
const router = express.Router();
const auth = require("../auth/auth.middleware");
const bodyParser = require("body-parser");
const urlEncoded = bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
});

const walletRepository = require("../wallet/wallet.repository");
const walletService = require("../wallet/wallet.service");
const Wallet = require("../wallet/wallet.model");
const authService = require("../auth/auth.service");

router.post("/init", urlEncoded, auth.verifyToken, async(req, res) =>{
    const customerId = req.body.customer_xid;
    if(!customerId){
        return res.status(400).json({status: "error", message: "field xid required"});
    }

    let wallet = await Wallet.findOne({customerId});
    if(wallet){
        return res.status(409).json({status: "error", message: "Wallet Already Initialized"});
    }

    await walletRepository.create(customerId);
    res.status(201).json({status: "success", message: "Wallet Successfully Initialized"});
});

router.post("/", auth.verifyToken, async(req, res) =>{
    const { xid } = auth.decodeToken(req);
    let wallet = await Wallet.findOne({customerId: xid, enabled: false});
    if(!wallet){
        return res.status(400).json({status: "error", message: "Wallet already enabled"});
    }

    wallet = await Wallet.findOneAndUpdate({customerId: xid},
        {enabled: true, enabledAt: Date.now(), disabledAt: null}, {returnOriginal: false});
    let responseBody = {
        id: wallet._id,
        owned_by: wallet.customerId,
        status: wallet.enabled ? "enabled": "disabled",
        balance: wallet.balance,
        enabledAt: wallet.enabledAt
    }
    res.status(200).json({status: "success", data: { wallet: responseBody } });
});

router.patch("/", urlEncoded, auth.verifyToken, async(req, res) =>{
    const { xid } = auth.decodeToken(req);


    try{
        const is_disabled = req.body.is_disabled;
        if ( is_disabled === 'true') {
            const wallet = await Wallet.findOneAndUpdate({customerId: xid},
                {enabled: false, disabledAt: Date.now(), enabledAt: null}, {returnOriginal: false});

            const responseBody = {
                id: wallet._id,
                owned_by: wallet.customerId,
                status: wallet.enabled ? "enabled": "disabled",
                balance: wallet.balance,
                disabledAt: wallet.disabledAt
            }
            return res.status(200).json({status: "success", data: { wallet: responseBody } });
        }
    }catch (e){

        return res.status(400).json({status: "error", message: e.message});
    }
    res.status(400).json({status: "error", message: "Disable Failed"});
});

router.get("/", auth.verifyToken, async (req, res) => {
    const { xid } = auth.decodeToken(req);

    const wallet = await Wallet.findOne({
        customerId: xid, enabled: true
    })
    if( !wallet) {
        return res.status(400).json({status: "error", message: "Invalid Wallet Balance"});
    }
    const responseBody = {
        id: wallet._id,
        owned_by: wallet.customerId,
        status: wallet.enabled ? "enabled": "disabled",
        balance: wallet.balance,
        enabledAt: wallet.enabledAt
    }
    const result = { status: "success", body: { wallet: responseBody }};

    res.status(200).json(result);
});

router.post("/deposits", urlEncoded, auth.verifyToken, async(req,res) =>{
    const { xid } = auth.decodeToken(req);
    const { amount, reference_id } = req.body;

    if(!(amount && reference_id)){
        return res.status(400).json({status: "error", message: "amount and reference_id all required"})
    }

    if( parseFloat(amount) < 0 ){
        return res.status(400).json({status: "error", message: "Amount must larger than zero"})
    }
    const deposit = await walletService.deposits({xid, amount, reference_id}, res);
    if( deposit.status !== "success"){
        return res.status(400).json({status:"error", message: deposit.message});
    }
    const responseBody = {
        id: deposit.depositId,
        deposited_by: deposit.customerId,
        status: deposit.status,
        amount: parseFloat(amount),
        deposited_at: deposit.depositedAt,
        reference_id: deposit.referenceId
    }
    res.status(201).json({status: "success", body: { deposit: {responseBody} }});
})

router.post("/withdrawals", urlEncoded, auth.verifyToken, async(req,res) =>{
    const { xid } = auth.decodeToken(req);
    const { amount, reference_id } = req.body;

    if(!(amount && reference_id)){
        return res.status(400).json({status: "error", message: "amount and reference_id all required"})
    }
    if( parseFloat(amount) < 0 ){
        return res.status(400).json({status: "error", message: "Amount must larger than zero"})
    }

    const withdraw = await walletService.withdrawals({xid, amount: -amount, reference_id}, res);

    if (withdraw.status !== "success"){
        return res.status(400).json({status: "error", message: withdraw.message});
    }
    const responseBody = {
        id: withdraw.withdrawalId,
        withdrawn_by: withdraw.customerId,
        status: withdraw.status,
        amount: parseFloat(amount),
        withdrawn_at: withdraw.withdrawnAt,
        reference_id: withdraw.referenceId
    }

    res.status(200).json({status: "success", body: { withdrawal: responseBody }});
})

module.exports = router