const fs = require('fs');
const User = require('../models/UserInfo');
const userModel = require('../models/User');





module.exports.getUser = async function(value, field = ''){
    return field ? (field == 'id' ? await User.findById(value) : await User.findOne({lastName: value})) : await User.findOne({email: value});
}
module.exports.addUser = async function(data) {
   const user = await this.getUser(data.email, 'email');
   if(!user) {
    return await User.create( {
        user_id: data.user_id,
        firstName: data.firstName,
        lastName: data.lastName,
        type: data.type,
        contact: data.contact,
        email: data.email,
        country: data.country,
        town: data.town
    })
   } else {
    return {errors: {message: 'Un utilisateur avec cet addresse email existe déjà'}}
   }
}

module.exports.update = async (obj) =>{
    let data = [], res = [];
    if(!obj) { return {errors: {message: 'Auccune donnée fourni'}} }
    const u = User.update(obj);
    if(u) {
        await userModel.findByIdAndUpdate(u.user_id, {name: u.lastName});
        return u;
    }else {
        return {errors: {message: 'Failed to update user information'}}
    }

}
