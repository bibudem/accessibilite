const db = require('../util/database');
let SqlString = require('sqlstring'); //global declare
let datetime = require('node-datetime');

module.exports = class Outils {
  constructor() {
  }


  static allFonds() {
    //afficher la requette
    /*let sql = "SELECT * FROM lst_fonds order by titre "
    console.log('sql: ', SqlString.format(sql));*/
    return db.execute('SELECT * FROM lst_fonds order by titre');
  }

  static async addFond(fond) {
    //creation de la date
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    //console.log(date);
    //ajouter la date dans le tableau des données
    fond.push(date);
    //afficher la requette
   /*let sql = "INSERT INTO lst_fonds SET titre = ?,description =?,dateA =? "
    console.log('sql: ', SqlString.format(sql,[fond[0],fond[1],fond[2]]));*/
    return db.execute('INSERT INTO lst_fonds SET titre = ?,description =?,dateA =?', [fond[0],fond[1],fond[2]] );

  }

  static async putFond(fond) {
    //creation de la date
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    //afficher la requette
    /*let sql = "UPDATE lst_fonds SET titre = ?,description =?,dateM =? WHERE idFond  = ?"
    console.log('sql: ', SqlString.format(sql,[fond[1],fond[2],date, fond[0]]));*/

    return db.execute('UPDATE lst_fonds SET titre = ?,description =?,dateM =? WHERE idFond  = ?',
      [fond[1],fond[2],date, fond[0]]);

  }

  static async deleteFond(idFond) {
   /* let sql = "DELETE FROM lst_fonds WHERE idFond  = ?"
    console.log('sql: ', SqlString.format(sql,[idFond]));*/
    return db.execute('DELETE FROM lst_fonds WHERE idFond  = ?', [idFond]);
  }

//recouperer la fiche
  static ficheFond(idFond){
    return db.execute('SELECT * FROM lst_fonds WHERE idFond  = ?', [idFond]);
  }

  static allFournisseurs() {
    //afficher la requette
    /*let sql = "SELECT * FROM tbl_fournisseurs order by nom "
    console.log('sql: ', SqlString.format(sql));*/
    return db.execute('SELECT * FROM tbl_fournisseurs  order by nom');
  }

  static async addFournisseur(value) {
    //creation de la date
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    //console.log(date);
    //ajouter la date dans le tableau des données
    value.push(date);
    //afficher la requette
    /*let sql = "INSERT INTO tbl_fournisseurs SET titre = ?,description =?,dateA =? "
     console.log('sql: ', SqlString.format(sql,[value[0],value[1],value[2],value[3]]));*/
    return db.execute('INSERT INTO tbl_fournisseurs SET nom = ?,programmes =?,note=?,dateA =?', [value[0],value[1],value[2],value[3]] );

  }

  static async putFournisseur(value) {
    //creation de la date
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    //afficher la requette
    /*let sql = "UPDATE tbl_fournisseurs SET nom = ?,programmes =?,note=?,dateMf =? WHERE idFournisseur  = ?"
    console.log('sql: ', SqlString.format(sql,[value[1],value[2],value[3],date, value[0]]));*/

    return db.execute('UPDATE tbl_fournisseurs SET nom = ?,programmes =?,note=?,dateMf =? WHERE idFournisseur  = ?',
      [value[1],value[2],value[3],date, value[0]]);

  }

  static async deleteFournisseur(id) {
    /* let sql = "DELETE FROM tbl_fournisseurs WHERE idFournisseur  = ?"
     console.log('sql: ', SqlString.format(sql,[idFond]));*/
    return db.execute('DELETE FROM tbl_fournisseurs WHERE idFournisseur  = ?', [id]);
  }

//recouperer la fiche
  static ficheFournisseur(id){
    return db.execute('SELECT * FROM tbl_fournisseurs WHERE idFournisseur  = ?', [id]);
  }

};

