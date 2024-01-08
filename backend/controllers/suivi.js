const Suivi = require('../models/suivi');

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
