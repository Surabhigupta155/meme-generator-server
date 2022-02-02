const twilio = require('twilio');
const accountSid = "AC32422590c16f4011a9f087aab6e1ae7f";
const authToken = "0d3cf09b1281eb47ea5465d5e774b988";
const client = new twilio(accountSid, authToken);

// +18066022864

const verifyOtp = async (phone_no, otp) => {

    let verify_check = await client.verify.services('VA5f2c74c945ac3014361a536a69c7ece5')
                            .verificationChecks
                            .create({ to: `+91${phone_no}`, code: otp })
    return verify_check.status

    // while((otp_status == undefined)) {
    //     require('deasync').runLoopOnce();
    // }

    // return otp_status;
}
module.exports = verifyOtp;