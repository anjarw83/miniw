const Wallet = require("./wallet.model");
const Mutation = require("../mutations/mutation.model");

const deposits = async({xid, amount, reference_id },res) => {

    const wallet = await Wallet.findOne({
        customerId: xid, enabled: true
    })
    if( !wallet) {
        return res.status(404).json({status: "error", message: "Invalid Wallet Balance"});
    }
    const mutation = await Mutation.findOne({customerId: xid, referenceId: reference_id});
    if ( mutation ){
        return res.status(400).json({status: "error", message: "Reference Id already exist"});
    }
    const result = await Wallet.findOneAndUpdate({customerId: xid}, {
        $inc: { balance: amount }
    }, {returnOriginal: false});
    await Mutation.create({customerId: xid, amount: amount, referenceId: reference_id});
    return result;
}

const withdrawals = async ({xid, amount, reference_id }, res) => {
    const wallet = await Wallet.findOne({
        customerId: xid, enabled: true
    })
    if( !wallet) {
        return res.status(404).json({status: "error", message: "Invalid Wallet Balance"});
    }
    const mutation = await Mutation.findOne({customerId: xid, referenceId: reference_id});
    if ( mutation ){
        return res.status(400).json({status: "error", message: "Reference Id already exist"});
    }
    const result = await Wallet.findOneAndUpdate({customerId: xid}, {
        $inc: { balance: -amount }
    }, {returnOriginal: false});
    await Mutation.create({customerId: xid, amount: amount, referenceId: reference_id});

    return result;
}

module.exports = {
    deposits,
    withdrawals
}