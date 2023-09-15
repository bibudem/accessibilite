const db = require('../util/database');
let SqlString = require('sqlstring'); //global declare
let datetime = require('node-datetime');

module.exports = class Suivi {
  constructor() {
  }

  static allSuivi(id) {
    return db.execute('SELECT * FROM tbl_suivi where idItem = ?', [id]);
  }

  static async deleteSuivi(id) {
    return db.execute('DELETE FROM tbl_suivi WHERE idSuivi  = ?', [id]);
  }

  static async addSuivi(objet) {
    //creation de la date
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    //ajouter la date dans le tableau des données
    objet.push(date);
    return db.execute('INSERT INTO tbl_suivi SET idSuivi=?,nom =?,prenom =?,note =?,cle =?,courriel =?,statut =?,idItem = ?,dateA =?', objet );

  }

  static async saveSuivi(objet) {
    //creation de la date
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    //afficher la requette
    /*let sql = "UPDATE tbl_suivi SET  nom =?,prenom =?,note =?,cle =?,courriel =?,statut =?,idItem = ?,dateM =? WHERE idSuivi  = ?"
    console.log('sql: ', SqlString.format(sql,[objet[1],objet[2],objet[3],objet[4],objet[5],objet[6],objet[7],date,objet[0]]));*/

    return db.execute('UPDATE tbl_suivi SET  nom =?,prenom =?,note =?,cle =?,courriel =?,statut =?,idItem = ?,dateM =? WHERE idSuivi  = ?',
      [objet[1],objet[2],objet[3],objet[4],objet[5],objet[6],objet[7],date,objet[0]]);

  }


};

