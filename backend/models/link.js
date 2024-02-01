const db = require('../util/database');
let SqlString = require('sqlstring'); //global declare
let datetime = require('node-datetime');

module.exports = class Link {
  constructor() {

  }

  static  getLink(key) {

    return  db.execute('SELECT pd.*, p.*, i.* FROM tbl_panier_details pd JOIN tbl_panier p ON pd.idPanier = p.idPanier JOIN tbl_items i ON pd.idItem = i.idItem WHERE p.cle = ?', [key] );

  }

  static  updateStateLink(id) {
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    /*let sql = "UPDATE `tbl_panier` SET statut = 'Inactif', dateM=? where idPanier= ?"
    console.log('sql: ', SqlString.format(sql,[date,id]));*/
    return  db.execute("UPDATE `tbl_panier` SET statut = 'Inactif', dateM=? where idPanier= ?", [date,id] );

  }


}
