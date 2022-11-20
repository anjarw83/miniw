const mongoose = require("mongoose");
const modelName = 'customer';

const CustomerSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },
    xid: {
      type: String
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    token: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(modelName, CustomerSchema);
