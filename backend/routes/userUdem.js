const express = require("express");
const userUdem = require("../controllers/userUdem");
const auth = require("../auth/auth");
const router = express.Router();
const Lib  = require("../util/lib");
const passport = require("passport");


router.get('', userUdem.getUserUdem);


router.use('/login',
  (req, res, next) => {
    //Logout
    //console.log(res);
    req.logout();

    auth.passport.authenticate('provider',{ failureRedirect: '/api/logout' })(req, res, next);
  });

//2.reponse
router.get('/callback.js',
  (req, res, next) => {
    req.logout();
    auth.passport.authenticate('provider', { failureRedirect: '/api/logout' },
      (err, user) => {
        if (err) {
          console.log('Erreur d\'authentification : ' + err.message);
          return next(err); // Passer l'erreur au gestionnaire d'erreurs express
        }

        if (!user) {
          console.log('2. not user: ');
          res.redirect('/api/logout');
        }

        req.logIn(user, function(err) {
          if (err) { return next(err); }
          auth.passport.session.userConnect=[]
          auth.passport.session.userConnect[Lib.sessionToken(req)]=JSON.stringify(user);
          return res.redirect('/accueil');
          //return res.status(200).json(user);
        });
      }
    )(req, res, next);
  }
);




module.exports = router;
