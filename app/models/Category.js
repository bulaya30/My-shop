const mongoose = require('mongoose');
const schema = mongoose.Schema;
const statement = new schema({
    name: {
        type: String,
        reequired: [true, 'Le nom de la categorie est recommandé']
    }
}, {timestamps: true})
const Category = mongoose.model('category', statement)
module.exports = Category
