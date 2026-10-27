const express = require("express");
const userUdem = require("../controllers/userUdem");
const auth = require("../auth/auth");
const router = express.Router();
const passport = require("passport");
const UserAuth = require("../auth/callback");


router.get('', userUdem.getUserUdem);


// Seuls les liens de partage sont acceptés comme destination après connexion
// (chemin relatif uniquement, pour éviter toute redirection vers un autre site).
function estLienPartage(chemin) {
  return typeof chemin === 'string' && /^\/lien\/[A-Za-z0-9-]+$/.test(chemin);
}

router.use('/login',
  (req, res, next) => {
    //Logout
    //console.log(res);
    req.logout();

    // Mémoriser le lien d'origine pour y revenir après l'authentification Microsoft
    if (estLienPartage(req.query.returnTo)) {
      req.session.returnTo = req.query.returnTo;
    } else {
      delete req.session.returnTo;
    }

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
          return res.redirect('/api/logout');
        }

        const returnTo = req.session.returnTo;
        delete req.session.returnTo;

        req.logIn(user, async function(err) {
          if (err) { return next(err); }
           // Vérification ou création du token
          const token = req.session.token || generateNewToken(user.email.toString());
          req.session.token = token;
          req.session.passport.user[token]  = JSON.stringify(user);
          //console.log(token);
          //console.log(req.session.passport.user[token]);
          if (estLienPartage(returnTo)) {
            return res.redirect(returnTo);
          }
          // Page d'arrivée selon le rôle : /accueil est réservé aux gestionnaires, et y envoyer
          // un étudiant le renvoyait aussitôt sur /not-user sans explication (« la page se recharge »)
          try {
            const [profil] = await UserAuth.returnUserUdem(req.session.passport.user[token]);
            if (profil.groupe === 'Admin') {
              return res.redirect('/accueil');
            }
            if (profil.groupe === 'Viewer') {
              return res.redirect('/historique-list');
            }
          } catch (e) {
            console.log('Profil illisible après connexion : ' + e.message);
          }
          return res.redirect('/not-user?connecte=1');
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
