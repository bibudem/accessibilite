"use strict";

const AzureOAuth2Strategy  = require("passport-azure-oauth2");
const jwt                   = require("jwt-simple");
const config                   = require("../config/config");

function AzureOAuthStrategy() {
  this.passport = require("passport");



  this.passport.use("provider", new AzureOAuth2Strategy({
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.redirectURI,
      scope:'openid%20profile%20email',
      response_type:'code',
      origin: "Application",
      state:false
    },


    function (accessToken, refreshToken, params, profile, done) {
      if (accessToken) {
        let user = jwt.decode(params.id_token, "name", true);
        //console.log(params);
        done(null, user);
      } else {
        done(new Error('Failed to obtain access token'));
      }
    }
    ));


  this.passport.serializeUser(function(user, done) {
    //console.log("profile 1: ", user);
    done(null, user);
  })

  this.passport.deserializeUser(function(user, done) {
    //console.log("profile 2: ", user);
    done(null, user);
  });

}

module.exports = new AzureOAuthStrategy();
