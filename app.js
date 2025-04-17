require('dotenv').config();
const express = require('express');
const cookie = require('cookie-parser');
const layout = require('express-ejs-layouts');
const db = require('./app/database/db')

const app = express();
const PORT = 4000 || process.env.PORT;

app.set('layout', './layouts/app');

app.set('view engine', 'ejs');
app.use(layout);
app.use(express.static('./public'));
app.use(express.json())
app.use(cookie());
app.use(express.urlencoded({extended: false}));

db.connect().then(()=>{
    app.use('/', require('./routes/web'))
    app.listen(PORT, () =>{
        console.log(`server started at http://localhost:${PORT}`)
    })
})


// 



