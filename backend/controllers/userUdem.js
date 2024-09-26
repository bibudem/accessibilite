const UserAuth = require("../auth/callback");
const Lib  = require("../util/lib");

exports.getUserUdem = async (req, res, next) => {

  try {
    //retourner vers la connexion si on n'a pas une bonne session pour cet utilisateur
    if(Lib.userConnect(req).length==0){
      return res.redirect('/api/logout');
    }

    const [ficheUser] = await UserAuth.returnUserUdem(Lib.sessionToken(req));

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
