const { user } = require('../../models')
const verifyOtp = require('../../helpers/verifyotp')
const router = require("express").Router();
const jwt = require('jsonwebtoken')
const generateAcessToken = require('../../accessToken/generateAcessToken')
// const {encode,decode} = require("../middlewares/crypt")
// var otpGenerator = require('otp-generator');
// var AWS = require('aws-sdk');
// const crypto = require('crypto');

router.post('/token', async (req, res, next) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    const accessToken = generateAcessToken({ phone_number: user.phone_no })
    res.json({ accessToken: accessToken })
  })
})

router.post('/verifyotp', async (req, res, next) => {

  try {

    const { otp, type, phone_number } = req.body;

    const verify_check = await verifyOtp(phone_number, otp);
    // console.log("==>", verif)
    if (verify_check === 'pending') {
      return res.status(404).json({ msg: 'Wrong OTP' })
    }
    else if (verify_check === 'canceled') {
      return res.status(403).json({ msg: 'User verification failed' })
    }
    else if (verify_check === 'approved') {
      if (type === 'signup') {
        const userres = await user.update({ verified: true }, {
          where: {
            phone_no: phone_number
          }
        });
        const username = userres.name;
        const userphone = userres.phone_no;
        let user = { phone_number: userphone };
        const accessToken = generateAcessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        return res.status(200).json({ msg: 'User signed in and verified successfully', accessToken: accessToken, refreshToken: refreshToken })
      }
      else if (type === 'login') {
        const userres = await user.findOne({ where: { phone_no: phone_number } })
        const verified = userres.verified;
        if (verified === true) {
          const username = userres.name;
          const userphone = userres.phone_no;
          let user = { phone_number: userphone };
          const accessToken = generateAcessToken(user)
          const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
          console.log(accessToken)
          return res.status(200).json({ msg: 'User logged in and verified successfully', accessToken: accessToken, refreshToken: refreshToken })
        }
        else {
          return res.status(403).json({ msg: 'Signup first' })
        }
      }
    }

  } catch (err) {
    const response = { "Status": "Failure", "Details": err.message }
    return res.status(400).send(response)
  }

});


module.exports = router;