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

  //objet pour langue
  lstLangue = [
    {id: 1, name: "Français"},
    {id: 2, name: "Anglais"},
    {id: 3, name: "Espagnol"},
    {id: 4, name: "Autre"}
  ];

  //objet Type de document
  lstTypeDocument = [
    {id: 1, name: "Livres"},
    {id: 2, name: "Articles"},
    {id: 3, name: "Chapitres"},
    {id: 4, name: "Autre"}
  ];

  //objet pour Format substitut
  lstFormatSubstitut = [
    {id: 1, name: "PDF image"},
    {id: 2, name: "PDF consultable"},
    {id: 3, name: "Texte"},
    {id: 4, name: "Etext"},
    {id: 5, name: "Audio"},
    {id: 6, name: "Epub"},
    {id: 7, name: "Braille"},
    {id: 8, name: "Autre"},
  ];

  //objet pour Éléments visuels accessibles
  lstVisuelAccessible = [
    {id: 1, name: "Oui"},
    {id: 2, name: "Non"},
    {id: 3, name: "Partiel"}
  ];

  //objet pour Éléments visuels accessibles
  lstDocComplet = [
    {id: 1, name: "Oui"},
    {id: 2, name: "Non"}
  ];

}
