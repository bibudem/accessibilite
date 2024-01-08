const db = require('../util/database');
let SqlString = require('sqlstring'); //global declare
let datetime = require('node-datetime');

module.exports = class Suivi {
  constructor() {
  }

  static allSuivi(id) {
    return db.execute('SELECT p.idPanier, p.sujet, p.nom as nom, p.prenom as prenom, p.courriel as courriel, p.statut as statut,p.sujet as sujet, p.dateActivation as dateActivation,p.dateExpiration as dateExpiration,p.nbrJours as nbrJours, pd.idItem AS idItem, pd.idDetails as idDetails FROM tbl_panier p JOIN tbl_panier_details pd ON p.idPanier = pd.idPanier   WHERE   pd.idItem = ? order by dateActivation DESC', [id]);
  }



};

