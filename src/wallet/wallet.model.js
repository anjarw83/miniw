const mongoose = require("mongoose");
const modelName = 'wallet';

const WalletSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0.0
    },
    enabled: {
        type: Boolean,
        default: false
    },
    enabledAt: {
        type: Date,
    },
    disabledAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(modelName, WalletSchema);
