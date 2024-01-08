const Panier = require('../models/panier');

exports.post = async (req, res, next) => {
  try {
    let values=Object.values(req.body);
    const postResponse = await Panier.post(values);
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    let values=Object.values(req.body);
    //console.log(Object.values(values));
    const putResponse = await Panier.update(values);
    res.status(200).json(putResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    //console.log(req.params.id);
    const deleteResponse = await Panier.delete(req.params.id);
    res.status(200).json(deleteResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.consulter = async (req, res, next) => {
  try {
    const [fichePanier] = await Panier.consulter(req.params.id);
    res.status(200).json(fichePanier);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    const [all] = await Panier.getAll();
    res.status(200).json(all);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.addDetails = async (req, res, next) => {
  try {
    let values=Object.values(req.body);
    const [postResponse] = await Panier.addDetails(values);
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
