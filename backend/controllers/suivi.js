const Suivi = require('../models/suivi');

exports.addSuivi = async (req, res, next) => {
  try {
    let values=Object.values(req.body);
    //console.log(Object.values(values));
    const postResponse = await Suivi.addSuivi(values);
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.saveSuivi = async (req, res, next) => {
  try {
    let values=Object.values(req.body);
    //console.log(Object.values(values));
    const putResponse = await Suivi.saveSuivi(values);
    res.status(200).json(putResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteSuivi = async (req, res, next) => {
  try {
    //console.log(req.params.id);
    const deleteResponse = await Suivi.deleteSuivi(req.params.id);
    res.status(200).json(deleteResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.allSuivi = async (req, res, next) => {
  try {
    const [all] = await Suivi.allSuivi(req.params.id);
    res.status(200).json(all);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
