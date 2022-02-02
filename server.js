require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const logger = require('morgan');
const cookieParser = require('cookie-parser')
const passport = require('passport')
require('./config/passports')(passport);

const { sequelize } = require('./models')

const port = process.env.PORT || 5000;

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize());

var cors = require('cors');
var corsOption = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};

app.use(cors(corsOption));

app.use(helmet())

app.use(logger('common'))

const signup = require('../server/routes/user/signup');
const verify_otp = require('../server/routes/user/verifyOTP');
const login = require('../server/routes/user/login');
const countries_data = require('../server/routes/countries-data');

// const testing = require('./routes/testing');

app.use('/api/v1/', signup);
app.use('/api/v1/', verify_otp);
app.use('/api/v1/', login);
app.use('/api/v1/', countries_data);

// async function add(){
//     await Products.create({
//         product_name: 'product1',
//         product_price: 200,
//         description: 'description1',
//         s_id: 1
//     })
//     // await Products.create({
//     //     product_name: 'product2',
//     //     product_price: 300,
//     //     description: 'description2',
//     //     s_id: 1
//     // })
// }
// add();

// async function add(){
//         // await Products.create({
//         //     product_name: 'product1',
//         //     product_price: 200,
//         //     description: 'description1',
//         //     s_id: 1
//         // })
//         await Supplier.create({
//             supplier_name: 'abc',
//             address: 'abc, abc, abc',
//             phone_no: '9999999999',
//             verified: true,
//             email: 'abc@gmail.com',
//             rating: 3,
//             working_hours: '6'
//         })
//     }
//     add();

// app.get('/list', passport.authenticate('jwt', {session:false}), async(req, res, next) => { 
//     const userobj = await req.user
//     const userid = userobj.id
//     console.log("***===", userid);
//     return res.status(200).json({ msg: 'authentication successfull' })
// })

app.listen(port, async() => {
    console.log('Server up on http://localhost:5000')
    await sequelize.authenticate()
    console.log('Database Connected!');
})