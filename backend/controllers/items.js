const Items = require('../models/items');
const Lib = require("../util/lib");

exports.postItem = async (req, res, next) => {
  try {
    //retourner vers la connexion si on n'a pas une bonne session pour cet utilisateur
    if(Lib.userConnect(req).length==0){
      return res.redirect('/api/logout');
    }
    let values=Object.values(req.body);
    //console.log(Object.values(values));
    const postResponse = await Items.post(values);
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putItem = async (req, res, next) => {
  try {
    //retourner vers la connexion si on n'a pas une bonne session pour cet utilisateur
    if(Lib.userConnect(req).length==0){
      return res.redirect('/api/logout');
    }
    let values=Object.values(req.body);
    //console.log(Object.values(values));
    const putResponse = await Items.update(values);
    res.status(200).json(putResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    //retourner vers la connexion si on n'a pas une bonne session pour cet utilisateur
    if(Lib.userConnect(req).length==0){
      return res.redirect('/api/logout'); // Utilisez "return" ici pour éviter d'envoyer une autre réponse plus tard
    }
    //console.log(req.params.id);
    const deleteResponse = await Items.delete(req.params.id);
    res.status(200).json(deleteResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.consulterItem = async (req, res, next) => {
  try {
    //retourner vers la connexion si on n'a pas une bonne session pour cet utilisateur
    if(Lib.userConnect(req).length==0){
      return res.redirect('/api/logout');
    }
    const [ficheFilm] = await Items.consulter(req.params.id);
    res.status(200).json(ficheFilm);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.allItems = async (req, res, next) => {
  try {
    //retourner vers la connexion si on n'a pas une bonne session pour cet utilisateur
    if(Lib.userConnect(req).length==0){
      return res.redirect('/api/logout');
    }
    const [all] = await Items.allItems();
    res.status(200).json(all);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.allListeCollections = async (req, res, next) => {
  try {
    //retourner vers la connexion si on n'a pas une bonne session pour cet utilisateur
    if(Lib.userConnect(req).length==0){
      return res.redirect('/api/logout');
    }
    const [all] = await Items.allListeCollections();
    res.status(200).json(all);

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUrlItem = async (req, res, next) => {
  try {
    //retourner vers la connexion si on n'a pas une bonne session pour cet utilisateur
    if(Lib.userConnect(req).length==0){
      return res.redirect('/api/logout'); // Utilisez "return" ici pour éviter d'envoyer une autre réponse plus tard
    }
    let values=req.params.rep;
    const [all] = await Items.updateUrlItem(values);
    res.status(200).json(all);

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
