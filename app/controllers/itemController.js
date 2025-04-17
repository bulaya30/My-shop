const fs = require('fs');
const categoryController = require('./categoryController');
const model = require('../models/Item');
const categoryModel = require('../models/Category');

module.exports.getItems = async (field = '', item = '') => {
    return field ? ((field == 'id') ? await model.findById({_id: item}) : await model.findOne({name: item})) : await model.find();
}
module.exports.addItem = async (data) => {
    if(!data) return {errors: {message: 'Data cannot be empty'}}
    if(data.files && Object.keys(data.files).length !== 0) {
        let category = await categoryController.getCategories(data.body.category)
        if(category) {
            let file = data.files.image
            let name = file.name, ext = name.split('.')
            ext = ext[ext.length-1]
            name = Date.now()+'_'+data.body.name+'.'+ext
            await file.mv('./public/img/items/'+name, error => {
                if(error) {
                    return {errors: {message: 'Failed to add a new item, we could not find a related category name'}}
                }
            })
            return await model.create({
                category_id: category._id,
                name: data.body.name,
                quantity: data.body.quantity,
                price: data.body.price,
                discount: data.body.discount,
                image: name,
                path: './img/items/',
                description: data.body.description,
                details: data.body.details,
                supplier: data.body.supplier
            }) 
        } else {
            return {errors: {message: 'Failed to add a new Item, no category found'}}
        }
    } else {
        return {errors: {message: 'Failed to add a new Item'}}
    }
}
module.exports.updateItem = async (data) => {
    if(!data) return {errors: {message: 'Data cannot be empty'}}
    if(data.files && Object.keys(data.files).length !== 0) {
        try {
            let item = model.findById(data.body._id)
            fs.unlinkSync('./public/img/items/'+item.image)
            let file = data.files.image
            let name = file.name, ext = name.split('.')
            ext = ext[ext.length-1]
            name = Date.now()+'_'+data.body.name+'.'+ext
            await file.mv('./public/img/items/'+name, error => {
                if(error) { return {errors: {message: 'Failed to add a new item, we could not find a related category name'}} }
            }) 
            return {item: 'Item updated successfully'};
        } catch (error) {
            console.log(error)
            return {errors: {message: error}}
        }
    } else {
        let category = await categoryController.getCategories(data.body.category)
        if(category)  {
            return await model.findByIdAndUpdate(data.body._id, {
                category_id: category._id,
                name: data.body.name,
                quantity: data.body.quantity,
                price: data.body.price,
                discount: data.body.discount,
                description: data.body.description,
                details: data.body.details,
                supplier: data.body.supplier
            })
        }
    }

}
module.exports.deleteItem = async (item_id) => {
    return await model.findOneAndDelete(item_id);
}

module.exports.process = async (data) => {
    switch (data.body.action) {
        case 'Get': {
            return await this.getItems('id', data.body._id);
        }
        break;
        case 'Add': {
            return await this.addItem(data);
        }
        break;
        case 'Update': {
            return await this.updateItem(data);
        }
        break;
        case 'Delete': {
            return await this.deleteItem(data.body);
        }
        break;
        
        default:
            break;
    }
}
