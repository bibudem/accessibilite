const Rapport = require('../models/rapport');
const auth = require("../auth/auth");
const Lib = require("../util/lib");

exports.getItems = async (req, res, next) => {
  try {
    const [allItems] = await Rapport.fetchItems();
    console.log(allItems)
    res.status(200).json(allItems);

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
