const express = require("express");
const userUdem = require("../controllers/userUdem");
const auth = require("../auth/auth");
const router = express.Router();
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
           // Vérification ou création du token
          const token = req.session.token || generateNewToken(user.email.toString());
          req.session.token = token;
          req.session.passport.user[token]  = JSON.stringify(user);
          //console.log(token);
          //console.log(req.session.passport.user[token]);
          return res.redirect('/accueil');
          //return res.status(200).json(user);
        });
      }
    )(req, res, next);
  }
);

// Exemple de fonction pour générer un nouveau token
function generateNewToken(email) {
  const separator = "_"; // ou "-", ".", etc.
  const rep = Math.random().toString(36).substr(2) + separator + email;
  return rep;
}



module.exports = router;
