const {Router} = require('express');
const auth = require('../app/controllers/auth/AuthController')
const authMiddleware = require('../app/middleware/auth');
const route = Router();

route.get('/register', auth.registerPage)
route.post('/register', auth.registerProcess)
route.get('/login', auth.loginPage)
route.post('/login', auth.loginProcess)
route.get('/logout', auth.logout)


module.exports = route;