const WalletModel = require("./wallet.model");

const create = async wallet => {
    await WalletModel.create(wallet);
};