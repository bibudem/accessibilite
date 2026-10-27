const Link = require('../models/link');
const auth = require("../auth/auth");

// Un gestionnaire voit tous les paniers ; les autres seulement ceux adressés à leur courriel
const estProprietaire = (utilisateur, courriel) =>
  utilisateur.groupe === 'Admin' ||
  (courriel || '').toLowerCase() === (utilisateur.courriel || '').toLowerCase();

exports.getLink = async (req, res, next) => {
  try {
    console.log('Link: ');
    console.log(req.params.key);
    const [all] = await Link.getLink(req.params.key);
    res.status(200).json(all.filter(ligne => estProprietaire(req.utilisateur, ligne.courriel)));
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.updateStateLink = async (req, res, next) => {
  try {
    const [[panier]] = await Link.getPanier(req.params.id);
    if (!panier || !estProprietaire(req.utilisateur, panier.courriel)) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
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
