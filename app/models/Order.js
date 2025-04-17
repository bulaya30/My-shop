const mongoose = require('mongoose');
const schema = mongoose.Schema;
const statement = new schema({
    customer: {
        type: String,
        reequired: [true, 'Le nom du client est recommandé']
    },
    item_id: {
        type: String,
        reequired: [true]
    },
    quantity: {
        type: String,
        reequired: [true]
    },
    status: {
        type: String,
        reequired: [true]
    },
}, {timestamps: true})
const order = mongoose.model('order', statement);
module.exports = order;