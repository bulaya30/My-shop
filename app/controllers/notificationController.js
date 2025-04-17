const fs = require('fs');
const model = require('../models/Notification')

module.exports.getNotification = async (user = '') => {
    return user ? await model.findOne({user:user}) : await model.find();
}
module.exports.add = async (data) => {
    if(!data) return {errors: {message: 'No data given'}}
    return await model.create({ title: data.title, user: data.user, contents: data.contents})
}
module.exports.delete = async (data) => {
    if(!data) return {errors: {message: 'No data given'}}
    return await model.findByIdAndRemove(data._id)
}

module.exports.process = async (data) => {
    switch (data.action) {
        case 'Get': {
            return data
        }
        case 'Add': {
            return await this.add(data);
        }
        break;
        case 'Delete': {
            return await this.delete(data);
        }
        break;
        
        default:
            break;
    }
}




