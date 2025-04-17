
const model = require('../models/Category');



module.exports.getCategories = async (field = '', value = '') => {
    return (field && value) ? (field == 'id' ? await model.findById({_id: value}) : await model.findOne({name: value})) : await model.find()
}
module.exports.addCategory = async (data) => {
    if(!data) return {errors: {message: 'Data cannot be empty'}};
    const category = await this.getCategories('name', data.name);
    return category ? {errors: {message:'That Category name is already used'}} : await model.create({name: data.name});
}
module.exports.updateCategory = async (data) => {
    if(!data) return {errors: {message: 'Data cannot be empty'}};
    let category = await this.getCategories('name', data.ref_name)
    return category ? await model.findByIdAndUpdate(category._id, {name: data.name}) : {errors : {message: 'No category found with that name'}}
}
module.exports.deleteCategory = async (data) => {
    let category = await this.getCategories('name', data.name)
    return category ? await model.findByIdAndDelete(category._id) : {errors : {message: 'No category found with that name'}};
}
module.exports.process = async (data) => {
    switch (data.action) {
        case 'Get': {
            return await this.getCategories('name', data.name)
        }
        case 'Add': {
            return await this.addCategory(data);
        }
        break;
        case 'Update': {
            return await this.updateCategory(data);
        }
        break;
        case 'Delete': {
            return await this.deleteCategory(data);
        }
        break;
        
        default:
            break;
    }
}