const mongoose = require("mongoose");
const modelName = 'mutation';

const MutationSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    referenceId: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(modelName, MutationSchema);
