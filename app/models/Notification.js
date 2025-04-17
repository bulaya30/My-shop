const mongoose = require('mongoose');
const schema = mongoose.Schema;
const statement = new schema({
    user: {
        type: String,
        reequired: [true, 'L\' id du client est recommandé']
    },
    title: {
        type: String,
        reequired: [true]
    },
    contents: {
        type: String,
        reequired: [true]
    }
}, {timestamps: true})

const notification = mongoose.model('notification', statement);
module.exports = notification;