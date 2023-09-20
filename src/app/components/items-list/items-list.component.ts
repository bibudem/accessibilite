import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MethodesGlobal } from 'src/app/lib/MethodesGlobal';
import { ItemService } from 'src/app/services/item.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  //les entêts du tableau
  displayedColumns = ['numero','titre','URL','collection','dateA','consulter'];
  listeItems: any[] = [];
  // @ts-ignore
  dataSource: MatTableDataSource<ListeItems>;

  @ViewChild(MatPaginator) paginator:  any;

  @ViewChild(MatSort)  matSort : MatSort | any;


  //importer les fonctions global
  global: MethodesGlobal = new MethodesGlobal();

  items$: Observable<any[]> | undefined;

  //prendre la valeur d'un input
  getValue(value:string){
    return value.trim();
  }

  //garder les titre rechercher dans les filtres
  textRechercher=''

  ifAdmin=false;

  constructor(private itemService: ItemService,
              private _location: Location) { }

  ngOnInit(): void {
    //creation du tableau
    this.creerTableau();

    this.textRechercher=this.historiqueRechercheZone();
    //ajout de niveau de securité
    this.ifAdmin=this.global.ifAdminFunction();
  }

//appliquer filtre
  applyFilter(filterValue: string) {
    localStorage.setItem('textFiltre','')
    this.textRechercher=this.historiqueRechercheZone()
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // @ts-ignore
    this.dataSource.filter = filterValue;

  }

  //fonction doit etre async pour attendre la reponse de la bd
  creerTableau() {
    try {
      this.items$ = this.fetchAll();
      let url: { toString: () => any; }[]=[];
      this.items$.toPromise().then(res => {
        if(res!== undefined){
          for (let i = 0; i < res.length; i++) {
            url[i]='/assets/files/items/'+res[i].URL+'/'+res[i].file;
            this.listeItems[i]={
              "numero":i+1,
              "idItem":res[i].idItem,
              "titre":res[i].titre,
              "file":res[i].file,
              "URL":url[i],
              "collection":res[i].collection,
              "dateA":res[i].dateA,
              "dateM":res[i].dateM
            }
          }
        }

        // Redéfinir le contenu de la table avec la pagination est la recherche une fois que le resultat de la bd est returné
        this.dataSource = new MatTableDataSource(this.listeItems);
        if (this.textRechercher != '') {
          this.applyFilter(this.textRechercher)
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.matSort;

      });
    } catch(err) {
      console.error(`Error : ${err.Message}`);
      //
    }
  }

//recouperer la liste des periodiques
  fetchAll(): Observable<any[]> {
    return this.itemService.fetchAll();
  }

  //garder les key pour le filtre de recherche
  historiqueRechercheZone(){
    let result=''
    // @ts-ignore
    let textFiltre=document.getElementById('textFiltre').value
    if(textFiltre!='')
      localStorage.setItem('textFiltre',textFiltre)

    if(localStorage.getItem('textFiltre'))
    { // @ts-ignore
      result=localStorage.getItem('textFiltre')
    }

    return result
  }
  //vider le filtre
  viderFiltre(){
    // @ts-ignore
    if(document.getElementById('textFiltre').value){
      // @ts-ignore
      document.getElementById('textFiltre').value=''
      localStorage.setItem('textFiltre','')
      this.applyFilter('')
    }

  }
//return historique page
  backClicked() {
    this._location.back();
  }
}
