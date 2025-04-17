const mongoose = require('mongoose');
const schema = mongoose.Schema;
const statement = new schema({
    category_id: {
        type: String,
        reequired: true
    },
    name: {
        type: String,
        reequired: [true, 'Nom de l\'iteme est recommandé']
    },
    quantity: {
        type: String,
        reequired: true
    },
    price: {
        type: String,
        reequired: true
    },
    discount: {
        type: String,
        reequired: true
    },
    image: {
        type: String,
        reequired: true
    },
    path: {
        type: String,
        reequired: true
    },
    description: {
        type: String,
        reequired: true
    },
    details: {
        type: String,
        reequired: true
    },
    supplier: {
        type: String,
        reequired: true
    }
}, {timestamps: true})
const Item = mongoose.model('item', statement)
module.exports = Item
