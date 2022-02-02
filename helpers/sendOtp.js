const twilio = require('twilio');
const accountSid = "AC32422590c16f4011a9f087aab6e1ae7f";
const authToken = "0d3cf09b1281eb47ea5465d5e774b988";
const client = new twilio(accountSid, authToken);

// +18066022864

const sendOtp = async (phone_number) => {

    let otp_status = await client.verify.services('VA5f2c74c945ac3014361a536a69c7ece5')
                 .verifications
                 .create({to: `+91${phone_number}`, channel: 'sms'})
                //  .then(verification => {return await verification.status});
    return otp_status.status

    // while((otp_status == undefined)) {
    //     require('deasync').runLoopOnce();
    // }

    // return otp_status;
}


module.exports = sendOtp;