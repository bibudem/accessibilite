const db = require('../util/database');
let SqlString = require('sqlstring'); //global declare
let datetime = require('node-datetime');

module.exports = class Link {
  constructor() {

  }

  static  getLink(key) {

    return  db.execute('SELECT idSuivi, nom, prenom, courriel, cle,dateActivation,tbl_suivi.dateA as dateSuivi,tbl_suivi.idItem as id,statut,titre,file,URL FROM `tbl_suivi` INNER JOIN tbl_items on tbl_suivi.idItem=tbl_items.idItem where cle = ?', [key] );

  }

  static  updateStateLink(id) {
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    let sql = "UPDATE `tbl_suivi` SET statut = 'Inactif', dateM=? where idSuivi= ?"
    console.log('sql: ', SqlString.format(sql,[date,id]));
    return  db.execute("UPDATE `tbl_suivi` SET statut = 'Inactif', dateM=? where idSuivi= ?", [date,id] );

  }


}
