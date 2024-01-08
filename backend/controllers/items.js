const Items = require('../models/items');

exports.postItem = async (req, res, next) => {
  try {
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
