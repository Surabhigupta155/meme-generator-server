const { user } = require('../../models')
const sendOtp = require('../../helpers/sendOtp')
const router = require("express").Router();

// const {encode,decode} = require("../middlewares/crypt")
// var otpGenerator = require('otp-generator');
// var AWS = require('aws-sdk');
// const crypto = require('crypto');

router.post('/login', async (req, res, next) => {

    
    try {

        const { phone_number } = req.body;

        const rowdbres = await user.findOne({ where: { phone_no: phone_number } })
        console.log('====', rowdbres);

        let otp_status;

        if (rowdbres !== null && rowdbres.verified === true) {
            try {
                console.error("reached here1");   
                otp_status = await sendOtp(phone_number);
                console.error("reached here2");
                console.log("==>", otp_status);
            
            } catch (e) {
                res.status(500).send(e.toString());
            }
        }
        else {
            return res.status(404).json({ msg: 'User not found' })
        }
        

        if (otp_status !== 'pending') {
            return res.status(500).json({ msg: 'Something went wrong' })
        } else {
            return res.status(200).json({ msg: 'Otp sent successfully' })
        }

    } catch (err) {
        const response = { "Status": "Failure", "Details": err.message }
        return res.status(400).send(response)
    }

});


module.exports = router;