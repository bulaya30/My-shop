const fs = require('fs');
const model = require('../models/Cart');
const itemModel = require('../models/Item');
const userController = require('./userInfoController');
const itemController = require('./itemController');

module.exports.getCart = async (customer) => {
    return await model.find({customer: customer})
}
module.exports.addCart = async (data) => {
    if(!data) return {errors: {message: 'Data cannot be empty'}};
    let item = await itemController.getItems('id', data.item_id)
    if(item){
        if(Number(item.quantity) >= Number(data.quantity)) {
            let qty = Number(item.quantity) - Number(data.quantity);
            await itemModel.findByIdAndUpdate(item._id, {quantity: qty})
            const cart = await model.find({customer: data.customer, item_id: data.item_id})
            
            if(cart.length > 0) {
                qty = Number(cart.quantity) + Number(data.quantity);
                return await model.findByIdAndUpdate(cart._id, {quantity: qty})
            } else {
                return await model.create({
                    customer: data.customer,
                    item_id: data.item_id,
                    quantity: data.quantity
                })
            }
        } else {
            return {errors: {message: 'Low quantity in the Stock'}}    
        }
    }else {
        return {errors: {message: 'No item found'}}
    }
}
module.exports.updateCart = async (data) => {
    if(!data) return {errors: {message: 'Data cannot be empty'}};
    const cart = await model.findById(data.order_id)
    if(cart) {
        let item = await itemModel.findById(cart.item_id) 
        await itemModel.findByIdAndUpdate(item._id, {quantity: (Number(item.quantity) + Number(cart.quantity))});
        let qty = (Number(data.quantity) > Number(cart.quantity)) ? Number(data.quantity) - Number(cart.quantity) :
        Number(cart.quantity) - Number(data.quantity);
        if(item.quantity >= qty) {
            qty = Number(item.quantity) - Number(qty)
            await itemModel.findByIdAndUpdate(item._id, {quantity: qty});
            return await model.findByIdAndUpdate(cart._id, {quantity: data.quantity})
        } else {
            return {errors: {message: 'Fail to update the cart quantity, insufficient item quantity'}}    
        }
    } else {
        return {errors: {message: 'No cart found'}} 
    }
}
module.exports.deleteCart = async (data) => {
    if(!data) return {errors: {message: 'Data cannot be empty'}};
    return await model.findByIdAndDelete(data.order_id)   
}

module.exports.process = async (data) => {
    switch (data.action) {
        case 'Add': {
            return await this.addCart(data);
        }
        break;
        case 'Update': {
            return await this.updateCart(data);
        }
        break;
        case 'Delete': {
            return await this.deleteCart(data);
        }
        break;
        
        default:
            break;
    }
}