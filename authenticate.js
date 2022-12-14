var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User=require('./models/user')
var JwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var config=require('./config.js');
var jwt=require('jsonwebtoken')

exports.local=passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken=function(user){
return jwt.sign(user,config.secretKey,{expiresIn:3600});
};

var opts={};
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config.secretKey;



exports.jwtPassport=passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{

    console.log('Jwt_payload',jwt_payload)
    User.findOne({_id:jwt_payload._id},(err,user)=>{
        if(err){
            return done(err,false)
        }
        else if(user){
            return done(null,user)
        }
        else{
            return done(null,false)
        }
    })
}))


exports.verifyUser=passport.authenticate('jwt',{session:false});
// exports.verifyAdmin = function (req, res, next) {

//     if (req.decoded._doc.admin == true) {
//         next();
//     } else {
//         // if the user is not admin
//         // return an error
//         var err = new Error('You are not authorized to perform this operation!');
//         err.status = 403;
//         return next(err);
//     }

// };
// exports.verifyAdmin = function(req, res, next){
//     var isAdmin = req.decoded._doc.admin
//     if (isAdmin) {
//         return next();
//     }
//     else {
//         // if user is not admin
//         // return an error
//         var err =  new Error ('You are not autorized to perform this   operation!');
//         err.status =  403;
//         return next(err);

//     }
// }
exports.verifyAdmin = function(params, err, next) {
    
    if (params.user.admin){    
      return next();
    } else {
      var err = new Error('Only administrators are authorized to perform this operation.');
      err.status = 403;
      return next(err);
    }
};
