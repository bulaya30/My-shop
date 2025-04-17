const account = require('../models/Account');
const userController = require('./userInfoController');
const notificationController = require('./notificationController');

module.exports.getAccount = async (user) => {
    return await account.findOne({customer: user})
}
module.exports.addAccount = async (data) => {
    if(!data) return {errors: {message: 'Data cannot be empty'}};
    let user = await account.findOne({customer: data.user})
    return user ? await this.updateAccount(data) : await account.create({customer: data.user, amount: data.amount})
}
module.exports.updateAccount = async (data) => {
    if(!data) return {errors: {message: 'Data cannot be empty'}};
    let user = await this.getAccount( data.user)
    if(user) {
        let amount = Number(data.amount) + Number(user.amount)
        return await account.findByIdAndUpdate(user._id, {amount: amount})
    } else {
        return {errors: {message: 'Failed to update user account'}};
    }
}
module.exports.deposit = async (data) => {
    if(!data) return {errors: {message: 'No data giver'}}
    let user = await this.getAccount( data.user)
    if(user) {
        const balance = await this.addAccount(data)
        if(balance) {
            const title = 'Cash Deposit';
            let contents = `Un montant de ${data.amount} USD a été déposé\n`;
            contents += `dans votre compte. La transaction a été faite utilisant\n`;
            contents += `Mobile Money numero ${data.number}\n`;
            contents += `Votre solde est de ${Number(balance.amount)+Number(data.amount)}\n`;
            await notificationController.add({user: data.user, title: title, contents: contents});
            return balance;
        } else {
            return {errors: {message: 'Failed to deposit'}}
        }
    } else {
        return {errors: {message: 'Failed to deposit, no user found with tha email address'}}
    }
}
module.exports.pay = async (data) =>{
    if(!data) return {errors: {message: 'No data giver'}}
    let user = await this.getAccount( data.user)
    if(user) {
        let amount = 0;
        if(Number(user.amount) >= Number(data.amount)){
            amount = Number(user.amount) - Number(data.amount)
            return await account.findByIdAndUpdate(user._id, {amount: amount})

        } else {
            return {errors: {message: 'Your account balance is low to make this order'}}
        }
    } else {
        return {errors: {message: 'Failed to proceed with payment'}};
    }    
}
module.exports.send = async (data) => {
    if(!data) return {errors: {message: 'No data giver'}}
    let user = await this.getAccount( data.user), receiver = await getAccount( data.receiver)
    if(user) {
        let amount = 0;
        if(Number(user.amount) >= Number(data.amount)){
            amount = Number(user.amount) - Number(data.amount)
            if(receiver) {
                await account.findByIdAndUpdate(user._id, {amount: amount}) 
                return await account.findByIdAndUpdate(receiver._id, {amount: data.amount}) 
            } else {
                return {errors: {message: 'Failed to send the money, unknown reciever email address'}}; 
            }
        } else {
            return {errors: {message: 'Your account balance is low to make this operation'}}
        }
    } else {
        return {errors: {message: 'Failed to send the money'}};
    }
}

module.exports.process = async (data) => {
    switch (data.action) {
        case 'Deposit': {
            return await this.deposit(data);
        }
        break;
        case 'Transfert': {
            return await this.send(data);
        }
        break;
        case 'Update': {
            return await this.updateAccount(data);
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