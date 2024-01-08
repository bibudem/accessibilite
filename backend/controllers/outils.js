const Outils = require('../models/outils');

exports.addFond = async (req, res, next) => {
  try {
    let values=Object.values(req.body);
    //console.log(Object.values(values));
    const postResponse = await Outils.addFond(values);
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putFond = async (req, res, next) => {
  try {
    let values=Object.values(req.body);
    //console.log(Object.values(values));
    const putResponse = await Outils.putFond(values);
    res.status(200).json(putResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteFond = async (req, res, next) => {
  try {
    //console.log(req.params.id);
    const deleteResponse = await Outils.deleteFond(req.params.id);
    res.status(200).json(deleteResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.ficheFond = async (req, res, next) => {
  try {
    const [fiche] = await Outils.ficheFond(req.params.id);
    res.status(200).json(fiche);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.allFonds = async (req, res, next) => {
  try {
    const [all] = await Outils.allFonds();
    res.status(200).json(all);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.addFournisseur = async (req, res, next) => {
  try {
    let values=Object.values(req.body);
    //console.log(Object.values(values));
    const postResponse = await Outils.addFournisseur(values);
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putFournisseur = async (req, res, next) => {
  try {
    let values=Object.values(req.body);
    //console.log(Object.values(values));
    const putResponse = await Outils.putFournisseur(values);
    res.status(200).json(putResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteFournisseur = async (req, res, next) => {
  try {
    //console.log(req.params.id);
    const deleteResponse = await Outils.deleteFournisseur(req.params.id);
    res.status(200).json(deleteResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.ficheFournisseur = async (req, res, next) => {
  try {
    const [fiche] = await Outils.ficheFournisseur(req.params.id);
    res.status(200).json(fiche);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.allFournisseurs = async (req, res, next) => {
  try {
    const [all] = await Outils.allFournisseurs();
    res.status(200).json(all);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
