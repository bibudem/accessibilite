const db = require('../util/database');
let SqlString = require('sqlstring'); //global declare
let datetime = require('node-datetime');

module.exports = class Logs {
  constructor() {

  }


  static async fetchCountBoard() {
    let totalItems = 0;
    let totalCollections = 0;
    let totalPanier = 0;

    const count1 = await db.execute('SELECT COUNT(idItem) as count FROM tbl_items');
    if (count1[0]['0'].count) totalItems = count1[0]['0'].count;

    const count2 = await db.execute('SELECT COUNT(id_collection) as count FROM tbl_collections');
    if (count2[0]['0'].count) totalCollections = count2[0]['0'].count;

    const count3 = await db.execute('SELECT COUNT(idPanier) as count FROM tbl_panier');
    if (count3[0]['0'].count) totalPanier = count3[0]['0'].count;

    return [{ totalItems, totalCollections, totalPanier }];
  }

  static async getGraphiqueDonnees() {
    //creation de l'année
    let dt = datetime.create();
    let annee = dt.format('Y')-1;
    let graphique=[]
    let i=0

    let result= await  db.execute('SELECT titre,Total_Item_Requests,Unique_Item_Requests,No_License FROM `tbl_statistiques` INNER JOIN `tbl_periodiques` on tbl_statistiques.`idRevue`=tbl_periodiques.`idRevue`  WHERE `annee`=? ORDER BY CAST(Total_Item_Requests AS UNSIGNED) DESC,CAST(citations AS UNSIGNED) DESC,CAST(articlesUdem AS UNSIGNED) DESC LIMIT 0,10',[annee]);

   while( i< 10){
      //console.log(result[0][i].titre)
      graphique[i]={'titre':result[0][i].titre,'Total_Item_Requests':result[0][i].Total_Item_Requests,'Unique_Item_Requests':result[0][i].Unique_Item_Requests,'No_License':result[0][i].No_License}
      i++
    }

    return[graphique]
  }


}
