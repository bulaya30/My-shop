const token = require('jsonwebtoken');
const User = require('../models/UserInfo');
const UserInfo = require('../controllers/userInfoController')
const UserModel = require('../models/UserInfo')

const auth = (req, res, next) =>{
    const user = req.cookies.jwt;
    if(user) {
        token.verify(user, process.env.secretKey, (er, decodedToken)=>{
            if(er) {
                res.redirect('/login');
            } else {
                next();
            }
        })
    } else {
        res.redirect('/login');
    }
}
const checkUser = (req, res, next) => {
    const userToken = req.cookies.jwt;
    if(userToken) {
        token.verify(userToken, process.env.secretKey, async (er, decodedToken)=>{
            if(er) {
                res.locals.user = null;
                next()
            } else {
                res.locals.user = await UserModel.findOne({user_id: decodedToken.id});
                next()
            }
        })
    } else {
        res.locals.user = null;
        next()
    }
}



module.exports.loggedUser = checkUser
module.exports.authentificate = auth