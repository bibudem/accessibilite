const Link = require('../models/link');
const auth = require("../auth/auth");

exports.getLink = async (req, res, next) => {
  try {
    console.log('Link: ');
    console.log(req.params.key);
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
    const [all] = await Link.updateStateLink(req.params.id);
    res.status(200).json(all);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
