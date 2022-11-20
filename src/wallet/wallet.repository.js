const Wallet = require("./wallet.model");

const create = async customerId => {
    try {
         await Wallet.create(customerId);
    } catch (e){
        console.log(`Error : ${e.message}`);
    }
    return true;
};

module.exports = {
    create
}