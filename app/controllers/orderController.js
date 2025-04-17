const fs = require('fs');
const model = require('../models/Order');
const itemModel = require('../models/Item');
const cartModel = require('../models/Cart');
const userController = require('./userInfoController');
const itemController = require('./itemController');
const cartController = require('./cartController');
const accountController = require('./accountController');
const notificationController = require('./notificationController');
const account = require('../models/Account');

module.exports.getOrder = async (user = '') =>{
    return user ? await model.findOne({customer:user}) : await model.find();
   
}
module.exports.placeOrder = async (data) => {
    if(!data) return {errors: {message:'No data was given'}};
    let orders = [], carts = await cartModel.find({customer: data.customer}), tot = 0,
    item = '';
    if(carts) {
        for(let i in carts) {
            let items = await itemModel.findById({_id: carts[i].item_id});
            item += items.name+ i == carts.length - 1 ? '' : ', ';
            tot += Number(carts[i].quantity) * Number(items.price);
        }
        let account = await accountController.pay({user: data.customer, amount: tot})
        if(account.errors) {
            return {errors: {message: 'Failed to place the order'}}
        } else {
            let newOrder;
            for(let i in carts){
                newOrder = await model.create({
                    customer: carts[i].customer,
                    item_id: carts[i].item_id,
                    quantity: carts[i].quantity,
                    status: 'Pending'
                });
                await cartModel.findByIdAndDelete(carts[i]._id);
            }
            
            tot += Number(data.sheeping);
            const title = 'Payement';
            let contents = `Un montant de ${tot} USD a été retiré\n`;
            contents += `dans votre compte pour le payement des article ci-après: \n`;
            contents += `${item}\n`;                
            await notificationController.add({user: data.user, title: title, contents: contents});
            return newOrder;
        }
    } else {
        return {errors: {message: 'Failed to place the order, your cart is empty'}}  
    }
}

module.exports.process = async (data) => {
    // return (data)
    switch (data.action) {
        case 'Make': {
            return await this.placeOrder(data);
        }
        break;
        case 'Update': {
            return data
        }
        break;
        case 'Delete': {
            return data
        }
        break;
        
        default:
            break;
    }
}