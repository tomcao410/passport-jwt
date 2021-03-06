const passport = require('passport');
const passportJWT = require('passport-jwt');
const config = require('./config');

const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const FacebookStrategy  = require('passport-facebook').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

//Create a passport middleware to handle user registration
passport.use('signup', new localStrategy({
  usernameField : 'userName',
  passwordField : 'password'
}, async (userName, password, done) => {
    try {
      //Save the information provided by the user to the the database
      const user = await User.create({ userName, password });
      //Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      done(error);
    }
}));

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
  usernameField : 'userName',
  passwordField : 'password'
}, async (userName, password, done) => {
  try {
    //Find the user associated with the userName provided by the user
    const user = await User.findOne({ userName });
    if( !user ){
      //If the user isn't found in the database, return a message
      return done(null, false, { message : 'User not found'});
    }
    //Validate password and make sure it matches with the corresponding hash stored in the database
    //If the passwords match, it returns a value of true.
    const validate = await user.isValidPassword(password);
    if( !validate ){
      return done(null, false, { message : 'Wrong Password'});
    }
    //Send the user information to the next middleware
    return done(null, user, { message : 'Logged in Successfully'});
  } catch (error) {
    return done(error);
  }
}));

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : '1612213_top_secret',
  //we expect the user to send the token as a query paramater with the name 'secret_token'
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));


// FacebookStrategy with Passport.
passport.use(new FacebookStrategy({
    clientID: config.facebook_key,
    clientSecret:config.facebook_secret ,
    callbackURL: config.callback_url,
    profileFields: ['id', 'email', 'photos', 'displayName']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);
      const { emails, photos } = profile;
      const user = { userName: emails[0].value, password: "", imageUrl: photos[0].value, type: 1 };
      await User.create(user);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }
));
