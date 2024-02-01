const db = require('../util/database');
let SqlString = require('sqlstring'); //global declare
let datetime = require('node-datetime');

module.exports = class Panier {

  static post(value) {
    //creation de la date
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    value.push(date);
    return db.execute('INSERT INTO  tbl_panier  SET idPanier =?, sujet=?, nom = ?,prenom= ?,courriel  =?,statut= ?, cle=?, dateActivation=?, nbrJours =?, dateExpiration = ?, note = ?, admin =?, dateA =? ', value );
  }

  static update(values) {
    //creation de la date
    let dt = datetime.create();
    let date = dt.format('Y-m-d H:M:S');
    //console.log(values);
    //afficher la requette
    /*let sql = "UPDATE  tbl_panier   SET sujet=?, nom = ?,prenom= ?,courriel  =?,statut= ?, cle=?, dateActivation=?, nbrJours =?, dateExpiration = ?, admin =?,dateM =? WHERE idPanier  = ?"
    console.log('sql: ', SqlString.format(sql,[values[1],values[2],values[3],values[4],values[5],values[6],values[7],values[8] ,values[9] ,values[10],values[11],date,values[0]]));*/

    return db.execute('UPDATE  tbl_panier   SET  sujet=?, nom = ?,prenom= ?,courriel  =?,statut= ?, note =?, cle=?, dateActivation=?, nbrJours =?, dateExpiration = ?, admin =?, dateM =? WHERE idPanier  = ?',[values[1],values[2],values[3],values[4],values[5],values[6],values[7],values[8] ,values[9],values[10],values[11],date,values[0]]);
  }

  static async delete(id) {
    await  db.execute('DELETE FROM  tbl_panier_details  WHERE idPanier  = ?', [id]);
    return db.execute('DELETE FROM  tbl_panier  WHERE idPanier  = ?', [id]);

  }

//recouperer la fiche
  static consulter(id){
    return db.execute('SELECT p.idPanier, p.sujet, p.nom as nom, p.prenom as prenom, p.courriel as courriel, p.statut as statut,p.sujet as sujet, p.dateActivation as dateActivation,p.dateExpiration as dateExpiration,p.nbrJours as nbrJours,p.cle as cle,p.note as note, i.idItem AS idItem, i.titre AS item_titre, i.auteur AS item_auteur, i.editeur AS item_editeur, i.annee AS item_annee, p.dateA as dateA, pd.idDetails as idDetails FROM tbl_panier p INNER JOIN tbl_panier_details pd ON p.idPanier = pd.idPanier INNER JOIN tbl_items i ON pd.idItem = i.idItem  WHERE p.idPanier  = ?', [id]);
  }

  static getAll(){
    return db.execute('SELECT p.idPanier, p.sujet, p.nom as nom, p.prenom as prenom, p.courriel as courriel, p.statut as statut,p.sujet as sujet, p.dateActivation as dateActivation,p.dateExpiration as dateExpiration,p.nbrJours as nbrJours,p.cle as cle, p.dateA as dateA FROM tbl_panier p  ORDER BY p.dateA DESC  ');
  }

  static async addDetails(values) {
    // création de la date
    const dt = datetime.create();
    const date = dt.format('Y-m-d H:M:S');

    try {
      // récupération du dernier idPanier
      const [rows] = await db.execute('SELECT MAX(idPanier) AS lastIdPanier FROM tbl_panier');
      const lastIdPanier = rows[0].lastIdPanier;

      for (const item of values) {
        const sql = "INSERT INTO tbl_panier_details SET idPanier=?, idItem=?, date=?";
        //console.log('sql: ', SqlString.format(sql, [lastIdPanier, item.idItem, date]));
        await db.execute(sql, [lastIdPanier, item.idItem, date]);
      }

      // retourner les info du panier
      return db.execute('SELECT * FROM  tbl_panier  WHERE idPanier  = ?', [lastIdPanier]);
    } catch (error) {
      console.error(error);
      throw error; // Propage l'erreur pour qu'elle soit gérée à un niveau supérieur si nécessaire
    }
  }



};

