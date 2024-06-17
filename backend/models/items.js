const db = require('../util/database');
let SqlString = require('sqlstring'); //global declare
let datetime = require('node-datetime');
let formidable = require('formidable');
let fs = require('fs');

module.exports = class Items {
//ajouter une fiche
  static post(values) {
    //creation de la date
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    //ajouter la date dans le tableau des données
    values.push(date);
    /*let sql = "INSERT INTO  tbl_items  SET idItem = ?,idColecttion =?,typeDocument =?,auteur = ?,annee = ?,titre = ?,editeur = ?,edition = ?,isbn = ?,format = ?,visuelAccessibles = ?,documentComplet = ?,description = ?,note = ?,langue = ?,file = ?,URL = ?,dateA =?"
    console.log('sql: ', SqlString.format(sql,values));*/

    return db.execute('INSERT INTO  tbl_items  SET idItem = ?,idColecttion =?,typeDocument =?,auteur = ?,annee = ?,titre = ?,editeur = ?,edition = ?,isbn = ?,format = ?,visuelAccessibles = ?,documentComplet = ?,description = ?,note = ?,langue = ?,file = ?,URL = ?,dateA =?', values );
  }

//mise a jour de la fiche
  static update(values) {
    //creation de la date
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    //afficher la requette
    /*let sql = "UPDATE tbl_items SET idColecttion =?,typeDocument =?,auteur = ?,annee = ?,titre = ?,editeur = ?,edition = ?,isbn = ?,format = ?,visuelAccessibles = ?,documentComplet = ?,description = ?,note = ?,langue = ?,file = ?,URL = ?,dateM =? WHERE idItem  = ?"
    console.log('sql: ', SqlString.format(sql,[values[1],values[2],values[3],values[4],values[5],values[6],values[7],values[8],values[9],values[10],values[11],values[12],values[13],values[14],values[15],values[16],date,values[0]]));*/

    return db.execute('UPDATE tbl_items SET idColecttion =?,typeDocument =?,auteur = ?,annee = ?,titre = ?,editeur = ?,edition = ?,isbn = ?,format = ?,visuelAccessibles = ?,documentComplet = ?,description = ?,note = ?,langue = ?,file = ?,URL = ?,dateM =? WHERE idItem  = ?',
      [values[1],values[2],values[3],values[4],values[5],values[6],values[7],values[8],values[9],values[10],values[11],values[12],values[13],values[14],values[15],values[16],date,values[0]]);
  }

//supprimer une fiche
  static delete(id) {
    return db.execute('DELETE FROM tbl_items WHERE idItem  = ?', [id]);
  }

//recouperer la fiche selon son id
  static consulter(id){
    return db.execute('SELECT * FROM tbl_items WHERE idItem  = ?', [id]);
  }

//recouperer la liste des items
  static allItems(){
    return db.execute('SELECT typeDocument,auteur,annee,titre,editeur,edition,isbn,format,visuelAccessibles,documentComplet,description,langue,file,URL,idItem,note,( SELECT nom from tbl_collections where id_collection=idColecttion) as collection,dateA FROM tbl_items order by titre');
  }

//recouperer la liste des collections
  static allListeCollections(){
    return db.execute('SELECT * FROM tbl_collections order by nom');
  }

  //mise a jour d'URL
  static async updateUrlItem(value){
    let idItem, ancienName, newName;
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    let result =[];
    if(value){
      idItem=Number(value.split('&')[0]);
      ancienName=value.split('&')[1];
      newName=value.split('&')[2];
      const path = './../src/assets/files/items/'+ancienName;
      const pathNew = './../src/assets/files/items/'+newName;

      try {
           fs.rename(path, pathNew, async  function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully renamed the directory.");
                result = await db.execute("UPDATE tbl_items SET URL = ?,dateM =? WHERE idItem  = ?", [newName,date,idItem]);
              }
            });

      } catch(err) {
        console.error(err)
      }
      return result;
    }

    return result;
  }

};

