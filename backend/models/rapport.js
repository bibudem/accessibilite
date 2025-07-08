const db = require('../util/database');
let SqlString = require('sqlstring'); //global declare
let datetime = require('node-datetime');

module.exports = class Rapport {
  constructor() {

  }


  static async fetchItems() {
       return db.execute('SELECT idItem,titre,auteur,editeur,edition,annee,isbn,docOriginal,format,visuelAccessibles,documentComplet,description,langue,typeDocument,note,dateA,dateM FROM tbl_items order by idItem');
   
  }

}
