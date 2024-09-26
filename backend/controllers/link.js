const Link = require('../models/link');
const auth = require("../auth/auth");
const Lib = require("../util/lib");

exports.getLink = async (req, res, next) => {
  try {
    //retourner vers la connexion si on n'a pas une bonne session pour cet utilisateur
    if(Lib.userConnect(req).length==0){
      return res.redirect('/api/logout');
    }
    const [all] = await Link.getLink(req.params.key);
    res.status(200).json(all);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.updateStateLink = async (req, res, next) => {
  try {
    //retourner vers la connexion si on n'a pas une bonne session pour cet utilisateur
    if(Lib.userConnect(req).length==0){
      return res.redirect('/api/logout');
    }
    const [all] = await Link.updateStateLink(req.params.id);
    res.status(200).json(all);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
