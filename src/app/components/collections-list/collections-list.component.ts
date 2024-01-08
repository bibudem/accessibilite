import {Component, OnInit, ViewChild} from '@angular/core';
import { Observable } from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import { MatPaginator } from '@angular/material/paginator';
import {MethodesGlobal} from "../../lib/MethodesGlobal";
import {CollectionService} from "../../services/collection.service";
import {Location} from '@angular/common';

@Component({
  selector: 'app-collections-list',
  templateUrl: './collections-list.component.html',
  styleUrls: ['./collections-list.component.css']
})
export class CollectionsListComponent implements OnInit {

  //les entêts du tableau
  displayedColumns = ['numero','nom','date','consulter'];
  listeItems: any[] = [];
  // @ts-ignore
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator:  any;

  @ViewChild(MatSort)  matSort : MatSort | any;


  //importer les fonctions global
  global: MethodesGlobal = new MethodesGlobal();

  items$: Observable<any[]> | undefined;

  ifAdmin=false;

  lastDateModif='';

  constructor(private collection : CollectionService,
              private _location: Location) { }

  ngOnInit(): void {
    //creation du tableau
    this.creerTableau();

    //ajout de niveau de securité
    this.ifAdmin=this.global.ifAdminFunction()
  }
  //return historique page
  backClicked() {
    this._location.back();
  }
  //appliquer filtre
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // @ts-ignore
    this.dataSource.filter = filterValue;

  }

  //fonction doit etre async pour attendre la reponse de la bd
  async creerTableau() {
    try {
      this.items$ = await this.collection.fetchAll();
      await this.items$.toPromise().then(res => {
        if(res!== undefined){
          for (let i = 0; i < res.length; i++) {
            if(!res[i].dateM){
              this.lastDateModif=res[i].dateA;
            } else this.lastDateModif=res[i].dateM;
            this.listeItems[i]={
              "numero":i+1,
              "id_collection":res[i].id_collection,
              "nom":res[i].nom,
              "lastDateModif":this.lastDateModif
            }
          }
        }
        // Redéfinir le contenu de la table avec la pagination est la recherche une fois que le resultat de la bd est returné
        this.dataSource = new MatTableDataSource(this.listeItems);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.matSort;
      });
    } catch(err) {
      console.error(`Error : ${err.Message}`);
      //
    }
  }
  //prendre la valeur d'un input
  getValue(value:string){
    return value.trim();
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
}
