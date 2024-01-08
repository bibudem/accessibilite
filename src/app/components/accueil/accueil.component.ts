import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Observable} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ItemService} from "../../services/item.service";
import {MethodesGlobal} from "../../lib/MethodesGlobal";
import {Router} from "@angular/router";
import { CollectionService } from '../../services/collection.service';



@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  //importer les fonctions global
  global: MethodesGlobal = new MethodesGlobal();

  listeItems: any[] = [];

  items$: Observable<any[]> | undefined;

  ifAdmin=false;


  constructor(private collection : CollectionService,
              private translate:TranslateService,
              private itemService: ItemService,
              private router: Router) {
  }

  ngOnInit(): void {
    //liste des collections
    this.creerTableau();
    //this.ifAdmin=this.global.ifAdminFunction();
  }


//chercher la liste des fournisseurs
  async creerTableauFournisseurs() {
    try {

    } catch(err) {
      console.error(`Error : ${err.Message}`);
    }
  }

  rechercherMotCle(value:string){
    localStorage.setItem('textFiltre',value.toString());
    this.reload('/items');
  }
  rechercherParCollection(value:string){
    localStorage.setItem('textFiltre',value.toString());
    this.reload('/items');
  }
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
  //fonction doit etre async pour attendre la reponse de la bd
  creerTableau() {
    try {
      this.items$ =  this.collection.fetchAll();
       this.items$.toPromise().then(res => {
        if(res!== undefined){
          for (let i = 0; i < res.length; i++) {
            this.listeItems[i]={
              "id_collection":res[i].id_collection,
              "nom":res[i].nom,
              "description":res[i].description
            }
          }
        }
      });
    } catch(err) {
      console.error(`Error : ${err.Message}`);
      //
    }
  }
}
