const userInfoController = require('../userInfoController')
const controller = require('../userController')
const token = require('jsonwebtoken')

// Creating jwt token to login the user
const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
    return token.sign({id}, process.env.secretKey, {expiresIn: maxAge})
}

module.exports.registerPage = (req, res) =>{
    const user = req.cookies.jwt;
    if(user) {res.redirect('/')} 
    res.render('./Auth/registration')
}
module.exports.loginPage = (req, res) =>{
    const user = req.cookies.jwt;
    if(user) { res.redirect('/')} 
    res.render('./Auth/login')
}
module.exports.registerProcess = async(req, res) =>{
    let user = await controller.add(req.body);
   if(user.errors) {
    res.status(400).json({errors: user.errors})
   } else {
    const userToken = createToken(user.user_id);
        res.cookie('jwt', userToken, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({user})
   }
    
}
module.exports.loginProcess = async (req, res) =>{
    const user = await controller.login(req.body);
    if(!user) {
        res.status(400).json({errors : {message: 'Wrong email address or password'}}) 
    } else {
        const userToken = createToken(user.user_id);
        res.cookie('jwt', userToken, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({user: user})
    }
}
module.exports.logout = (req, res) =>{
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/');
}