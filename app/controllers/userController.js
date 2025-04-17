const crypt = require('bcrypt');
const userInfoController = require('./userInfoController');
const accountModel = require('../models/Account');
const model = require('../models/User');

const errors = (er) => {
    let errorFields = {name: '', email: '', password: ''}
    if(er.code === 11000) {
        errorFields.email = 'That email address is already used'
    }
    if(er.message.includes('user validation failed')) {
        Object.values(er.errors).forEach(({properties}) => {
            errorFields[properties.path] = properties.message
        })
    }
    return errorFields;
} 

module.exports.getUser = async(email, field) =>{
    return await userInfoController.getUser(email, field)
}
module.exports.add = async (data) =>{
    if(!data) return {errors: {message: 'No data were given'}}
    let {name, email, password} = data;
    const user = await userInfoController.getUser(email);
    if(!user) {
        let type = await model.find();
        type = type.length == 0 ? 'Admin' : 'user';
        const u = await model.create({name, type, email, password})
        await accountModel.create({customer: u.email, amount: '0'})
        return await userInfoController.addUser({
            user_id: u._id,
            firstName: '',
            lastName: u.name,
            type: type,
            contact: '',
            email: u.email,
            address: '',
            country: '',
            town: ''
        })
    } else {
        return {errors: {message: 'Cet addresse email est déjà utilisé'}}
    }
}

async function updatePassword(email, oldPassword, newPassword) {
    const u = await getUser(email);
    if(u) {
        let pwd = await crypt.compare(oldPassword, u.password);
        if(pwd) {
            let salt = 10, password = await crypt.hash(newPassword, salt);
            return await user.findByIdAndUpdate(u._id, {password: password})
        } else {
            return {errors: {message: 'Failed to change the password, the password are not matching'}}
        }   
    } else {
        return {errors: {message: 'No user found with that e-mail address'}}
    }
}
module.exports.login = async function(obj) {
    let user = await model.login(obj.email, obj.password)
    return await this.getUser(user.email)
}
module.exports.process = async (data) => {
   switch (data.action) {
    case 'Get': {
       return await this.getUser(data.lastName, 'lastName');
    } 
    break;
    case 'Update': {
        return await userInfoController.update(data);
        // return data
    } 
    break;
    case 'UpdatePassword': {
        // return 
        return await updatePassword(data.user, data.oldPassword, data.newPassword);
    }
    break;
    default:
    break;
   } 
}