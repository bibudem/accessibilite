const db = require('../util/database');
let SqlString = require('sqlstring'); //global declare
let datetime = require('node-datetime');
let fs = require('fs');
const path = require('path');
const { DOSSIER_ITEMS, segmentValide } = require('../util/chemins');

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

    return db.execute('INSERT INTO  tbl_items  SET idItem = ?,typeDocument =?,auteur = ?,annee = ?,titre = ?,editeur = ?,edition = ?,isbn = ?,format = ?,visuelAccessibles = ?,documentComplet = ?,description = ?,docOriginal=?,note = ?,langue = ?,file = ?,URL = ?,dateA =?', values );
  }

//mise a jour de la fiche
  static update(values) {
    //creation de la date
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    //afficher la requette
    /*let sql = "UPDATE tbl_items SET typeDocument =?,auteur = ?,annee = ?,titre = ?,editeur = ?,edition = ?,isbn = ?,format = ?,visuelAccessibles = ?,documentComplet = ?,description = ?,docOriginal=?,note = ?,langue = ?,file = ?,URL = ?,dateM =? WHERE idItem  = ?"
    console.log('sql: ', SqlString.format(sql,[values[1],values[2],values[3],values[4],values[5],values[6],values[7],values[8],values[9],values[10],values[11],values[12],values[13],values[14],values[15],values[16],date,values[0]]));*/

    return db.execute('UPDATE tbl_items SET typeDocument =?,auteur = ?,annee = ?,titre = ?,editeur = ?,edition = ?,isbn = ?,format = ?,visuelAccessibles = ?,documentComplet = ?,description = ?,docOriginal=?,note = ?,langue = ?,file = ?,URL = ?,dateM =? WHERE idItem  = ?',
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

  // Vrai si ce fichier fait partie d'un panier non expiré destiné à ce courriel
  static async fichierAccessible(courriel, file, URL) {
    const [rows] = await db.execute(
      'SELECT 1 FROM tbl_panier p JOIN tbl_panier_details pd ON pd.idPanier = p.idPanier JOIN tbl_items i ON i.idItem = pd.idItem ' +
      'WHERE LOWER(p.courriel) = LOWER(?) AND i.file = ? AND i.URL = ? AND DATE(p.dateExpiration) >= CURDATE() LIMIT 1',
      [courriel, file, URL]
    );
    return rows.length > 0;
  }

  //mise a jour d'URL : renomme le dossier du fichier, puis met à jour la notice
  static async updateUrlItem(value){
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    const [id, ancienName, newName] = String(value || '').split('&');
    const idItem = Number(id);
    if (!Number.isInteger(idItem) || !segmentValide(ancienName) || !segmentValide(newName)) {
      const err = new Error('Paramètres de mise à jour d’URL invalides');
      err.statusCode = 400;
      throw err;
    }
    await fs.promises.rename(path.join(DOSSIER_ITEMS, ancienName), path.join(DOSSIER_ITEMS, newName));
    console.log(`[updateUrl] Dossier renommé : ${ancienName} -> ${newName}`);
    return db.execute("UPDATE tbl_items SET URL = ?,dateM =? WHERE idItem  = ?", [newName,date,idItem]);
  }

};

