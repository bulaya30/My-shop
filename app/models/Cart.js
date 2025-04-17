const mongoose = require('mongoose');
const schema = mongoose.Schema;
const statement = new schema({
    customer: {
        type: String,
        reequired: [true, 'L\'addresse email du client est recommandé']
    },
    item_id: {
        type: String,
        reequired: [true]
    },
    quantity: {
        type: String,
        reequired: [true]
    },
}, {timestamps: true})
const cart = mongoose.model('cart', statement);
module.exports = cart;