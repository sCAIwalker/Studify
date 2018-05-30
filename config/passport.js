const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport) {
    console.log("hi1");
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    console.log("hi");
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log("hi2");
        console.log(jwt_payload);
        User.getUserById(jwt_payload.data._id, (err, user) => {
            if (err) {
                return done(err, false);
            }

            if (user) {
                return done(null, user); 
            } else {
                return done(null, false);
            }
        });

    }))

}