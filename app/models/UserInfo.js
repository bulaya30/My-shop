const driver = require('mongoose');
const validator = require('validator')
const crypt = require('bcrypt')
const schema = new driver.Schema({
    user_id: {
        type: String,
        required: [true, 'Reference user Id is required']
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    country: {
        type: String
    },
    town: {
        type: String
    }
},{timestamps: true})

schema.statics.update = async function(obj) {
    let infos = await this.findOne({email:obj.email}), res = null;
    if(infos) {
        
        res = await this.findByIdAndUpdate(infos._id, { 
            firstName: obj.firstName, 
            lastName: obj.lastName, 
            contact: obj.contact, 
            email: obj.email, 
            address: obj.address, 
            country: obj.country, 
            town: obj.town 
        });
        res = await this.findOne({email:obj.email})
    }
    return res;
}

const userInfo = driver.model('userinformation', schema);
module.exports = userInfo;