const UserAuth = require("../auth/callback");

exports.getUserUdem = async (req, res, next) => {

  try {
    //console.log("===== SESSION =====");
    //console.log("Token:", req.session.token);
    //console.log("===================");

    // Vérifiez si l'utilisateur est connecté via les données de session
    if (!req.session.token||req.session.token==undefined) {
      //console.log("Session invalide - redirection vers logout");
      return res.redirect('/api/logout');
    }
    //console.log("UserData présent:", req.session.passport.user[req.session.token]);
    const [ficheUser] = await UserAuth.returnUserUdem(req.session.passport.user[req.session.token]);

    if(ficheUser=='not-user'){
      return res.redirect('/api/logout');
    }

    res.status(200).json(ficheUser);

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
