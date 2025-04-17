const mongoose = require('mongoose');
const schema = mongoose.Schema;
const statement = new schema({
    customer: {
        type: String,
        reequired: true
    },
    amount: {
        type: String,
        reequired: true
    }
}, {timestamps: true})
const account = mongoose.model('account', statement);
module.exports = account;
