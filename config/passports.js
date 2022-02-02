const passportJwT = require("passport-jwt");
const JwTStrategy = passportJwT.Strategy;
const ExtractJwT = passportJwT.ExtractJwt;

const { Users } = require('../models')

module.exports = function(passport){
    console.log('yes');
    passport.use(
        new JwTStrategy(
            {
                secretOrKey:process.env.ACCESS_TOKEN_SECRET,
                jwtFromRequest: ExtractJwT.fromAuthHeaderAsBearerToken()
            },
            function(jwt_payload, next){
                console.log("payload=> ", jwt_payload);
                const userobj = Users.findOne({ where: { phone_no: jwt_payload.phone_number } })
                console.log("reached======1");
                // if(err){
                //     return next(err, false);
                // }
                if(userobj){
                    return next(null, userobj);
                    
                }
                else{
                    return next(null, false);
                }
            }
        )
    )
}