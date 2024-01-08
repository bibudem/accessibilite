const db = require('../util/database');
let SqlString = require('sqlstring'); //global declare
let datetime = require('node-datetime');

module.exports = class Collections {

static post(value) {
  //creation de la date
  let dt = datetime.create();
  let date = dt.format('Y-m-d H:M:S');
  value.push(date);
  //console.log(value);
  /*let sql = "INSERT INTO  tbl_collections  SET id_collection=?, nom = ?,description= ?,image=?,dateA =? "
  console.log('sql: ', SqlString.format(sql,value));*/
  return db.execute('INSERT INTO  tbl_collections  SET id_collection=?, nom = ?,description= ?,image  =?,dateA =? ', value );
}

static update(revue) {
   //creation de la date
  let dt = datetime.create();
  let date = dt.format('Y-m-d H:M:S');
  //console.log(revue);
  //afficher la requette
  /*let sql = "UPDATE  tbl_collections  SET nom = ?,description= ?,image=?,dateM =? WHERE id_collection  = ?"
  console.log('sql: ', SqlString.format(sql,[revue[1],revue[2],revue[3],date,revue[0]]));*/

  return db.execute('UPDATE  tbl_collections   SET nom = ?,description= ?,image=?,dateM =? WHERE id_collection  = ?',[revue[1],revue[2],revue[3],date,revue[0]]);
}

static delete(id) {
  return db.execute('DELETE FROM  tbl_collections  WHERE id_collection  = ?', [id]);
}
//recouperer la fiche
static consulter(id){
  return db.execute('SELECT * FROM  tbl_collections  WHERE id_collection  = ?', [id]);
}

static getAll(){
  return db.execute('SELECT * FROM  tbl_collections  order by nom');
}

static uploud(file){
  console.log(file)
    return [];
  }

};

