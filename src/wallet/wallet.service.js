const Wallet = require("./wallet.model");
const Mutation = require("../mutations/mutation.model");

const deposits = async({xid, amount, reference_id },res) => {

    const wallet = await Wallet.findOne({
        customerId: xid, enabled: true
    })
    if( !wallet) {
        return {status: "error", message: "Invalid Wallet"};
    }
    let mutation = await Mutation.findOne({customerId: xid, referenceId: reference_id});
    if ( mutation ){
        return {status: "error", message: "Reference Id already exist"};
    }
    const result = await Wallet.findOneAndUpdate({customerId: xid}, {
        $inc: { balance: amount }
    }, {returnOriginal: false});
    mutation = await Mutation.create({customerId: xid, amount: amount, referenceId: reference_id});
    return { customerId: mutation.customerId, depositId: mutation._id, depositedAt: mutation.createdAt, status: "success", referenceId: reference_id } ;
}

const withdrawals = async ({xid, amount, reference_id }, res) => {
    const wallet = await Wallet.findOne({
        customerId: xid, enabled: true
    })
    if( !wallet) {
        return {status: "error", message: "Invalid Wallet Balance"};
    }
    let mutation = await Mutation.findOne({customerId: xid, referenceId: reference_id});
    if ( mutation ){
        return {status: "error", message: "Reference Id already exist"};
    }
    const result = await Wallet.findOneAndUpdate({customerId: xid}, {
        $inc: { balance: -amount }
    }, {returnOriginal: false});
    mutation = await Mutation.create({customerId: xid, amount: amount, referenceId: reference_id});

    return { customerId: mutation.customerId, withdrawalId: mutation._id, withdrawnAt: mutation.createdAt, status: "success", referenceId: reference_id };
}

module.exports = {
    deposits,
    withdrawals
}