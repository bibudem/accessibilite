//class qui regroupes les liste de choix pour differents champs
export class ListeChoixOptions  {

  //les options pour le select
  listPlateformesObj = [];

  //options type
  listType = [
    { id: 1, name: "Online Book" },
    { id: 2, name: "E Major Reference Work" }
  ];

  //options Statut
  listNbrJoursValides = [
    { id: 30, name: "30 jours" },
    { id: 60, name: "60 jours" },
    { id: 90, name: "90 jours" }
  ];

  //objet pour les sujets
  listeLangue = [
    {id: 1, name: 'Français'},
    {id: 2, name: 'Anglais'},
    {id: 3, name: 'Espagnol'},
    {id: 4, name: 'Autres'}
  ];

}
