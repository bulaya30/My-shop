const express = require('express');
const Auth = require('../routes/auth');
const authMiddleware = require('../app/middleware/auth');
const userInfoController = require('../app/controllers/userInfoController');
const userController = require('../app/controllers/userController');
const categoryController = require('../app/controllers/categoryController');
const itemController = require('../app/controllers/itemController');
const cartController = require('../app/controllers/cartController');
const orderController = require('../app/controllers/orderController');
const accountController = require('../app/controllers/accountController');
const mail = require('../app/controllers/mailController');
const notificationController = require('../app/controllers/notificationController');
const file = require('express-fileupload');
const user = require('../app/models/User');
const categoryModel = require('../app/models/Category');
const itemModel = require('../app/models/Item');

const route = express.Router();

route.use(file())


route.get('*', authMiddleware.loggedUser)
route.get('/notification',async (req, res)=>{
   res.json(await notificationController.getNotification(user.email))
})
route.get('', async(req, res) =>{
    const user = res.locals.user;
    if(user) {
        let carts = await cartController.getCart(user.email)
        const categories = await categoryController.getCategories()
        res.render('./items/index', {user: user, items: await itemController.getItems(), categories: categories, cart: carts})    
    } else {
        res.render('./items/index', {items: await itemController.getItems(), categories: await categoryController.getCategories()})    
    }
})
route.get('/item/:id', async (req, res) =>{
    const user = res.locals.user;
    const item = await itemController.getItems('id', req.params.id)
    let related = await categoryController.getCategories('id', item.category_id)
    related =  await itemModel.find({category_id: related._id});
    if(user) {
        carts = await cartController.getCart(user.email)
        res.render('./items/details', {item: item, related: related, cart: carts})
    } else {
        res.render('./items/details', {item: item, related: related})
    }
    
});
route.get('/category/:id', async (req, res) => {
    const categories = await categoryController.getCategories()
    const category = await categoryModel.findById({_id: req.params.id})
    const item = await itemModel.find({category_id: category._id})
    if(res.locals.user) {
        const carts = await cartController.getCart(user.email)
        res.render('./items/category', {user: res.locals.user, cart: carts, items: item, categories: categories, category: category})
    } else {
        res.render('./items/category', {items: item, categories: categories, category: category})
    }
});
route.get('/cart', authMiddleware.authentificate, async (req, res) =>{
    const user = res.locals.user;
    let item = [], data = [], carts = [];
    carts = await cartController.getCart(user.email)
    for(let i in carts) {
        item = await itemModel.findById({_id: carts[i].item_id});
        data.push({
            _id: carts[i]._id,
            item_id: item._id,
            category_id: item.category_id,
            name: item.name,
            quantity: carts[i].quantity,
            price: item.price,
            discount: item.discount,
            path: item.path,
            image: item.image,
            description: item.description,
            details: item.details,
            total: Number(item.price) * Number(carts[i].quantity)
        }) 
    }
    res.render('./items/cart', {user: user, cart: carts, items: data})
});
route.get('/checkout', authMiddleware.authentificate, async (req, res)=>{
    const user = res.locals.user;
    let account = [], cart = [], item = [], data = [], carts = [], notification = [];
    carts = await cartController.getCart(user.email);
    account = await accountController.getAccount(user.email)
    for(let i in carts) {
        item = await itemModel.findById({_id: carts[i].item_id});
        data.push({
            _id: carts[i]._id,
            category_id: item.category_id,
            name: item.name,
            quantity: carts[i].quantity,
            price: item.price,
            discount: item.discount,
            path: item.path,
            image: item.image,
            description: item.description,
            details: item.details,
            total: Number(item.price) * Number(carts[i].quantity)
        }) 
    }
    res.render('./items/checkout', {user: user, cart: carts, account: account, items: data})
    // res.send({cart:data})
});
route.get('/order', (req, res) =>{
    res.render('./items/order', {user: res.locals.user, order: orderController.get()})    
})
route.get('/profile', authMiddleware.authentificate, async (req, res)=>{
    const user = res.locals.user;
    let items = [], newOrderObj = [];
    const carts = await cartController.getCart(user.email);
    const order = (!user.type == 'Admin') ? await orderController.getOrder(user._id) : await orderController.getOrder();
    const account = await accountController.getAccount(user.email);
    const notification = (!user.type == 'Admin') ? await notificationController.getNotification(user.email) : await notificationController.getNotification();
    for(let i in order) {
        items = await itemController.getItems('id', order[i].item_id)
        newOrderObj.push({
            _id: order[i]._id,
            customer: order[i].customer,
            item: items.name,
            quantity: order[i].quantity,
            price: items.price,
            image: items.image,
            path: items.path,
            status: order[i].status,
            total: Number(order[i].quantity) * Number(items.price)
        })
    }
    if(user.type == 'Admin') {
        res.render('./users/admin', {user: user, 
            items: await itemController.getItems(), categories: await categoryController.getCategories(),
            orders: newOrderObj, account: account, cart: carts
        })
    } else {
        res.render('./users/profile', {user: user, 
        items: await itemController.getItems(), categories: await categoryController.getCategories(),
            orders: newOrderObj, account: account, cart: carts, notification: notification
        })
    }
})
route.post('/process', authMiddleware.authentificate, async (req, res) =>{
    // console.log(req.body)
    if(req.body) {
        switch (req.body.table) {
            case 'user': {
                result = await userController.process(req.body)
                res.status(201).json(result)
            }                
            break;
            case 'Item' : {
                result = await itemController.process(req)
                res.status(201).json(result)
            }
            break;
            case 'Category' : {
                result = await categoryController.process(req.body)
                res.status(201).json(result)
            }
            break;
            case 'Cart' : {
                result = await cartController.process(req.body)
                res.status(201).json(result)
                
            }
            break;
            case 'Order' : {
                result = await orderController.process(req.body)
                res.status(201).json(result)
                // res.send('Asking to make the order')
            }
            break;
            case 'Account' : {
                result = await accountController.process(req.body)
                res.status(201).json(result)
                // res.send('Asking to make the order')
            }
            break;
            case 'Account' : {
                result = await accountController.process(req.body)
                res.status(201).json(result)
            }
            break;
            case 'Notification' : {
                result = await notificationController.process(req.body)
                res.status(201).json(result)
            }
            break;

            default:
            break;
        }
    }
    
})
route.use(Auth);

module.exports = route;

// route.use(Auth);