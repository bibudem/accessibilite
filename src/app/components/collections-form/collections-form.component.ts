import {Component, ElementRef, EventEmitter,  OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import { Observable } from "rxjs";
import {map, tap } from "rxjs/operators";
import {CollectionService} from "../../services/collection.service";
import { ActivatedRoute } from "@angular/router";
import { NgForm} from '@angular/forms';
import {MethodesGlobal} from "../../lib/MethodesGlobal";
import {TranslateService} from "@ngx-translate/core";
import {Location} from '@angular/common';
import { Collection } from "../../models/Collection";
import { FormControl, Validators } from "@angular/forms";



@Component({
  selector: "app-collections-form",
  templateUrl: "./collections-form.component.html",
  styleUrls: ["./collections-form.component.css"],
})
export class CollectionsFormComponent implements OnInit {

  [x: string]: any;
//*********Section variables*****************************************//

  //titre boutton
  bouttonAction='';

  collections$: Observable<any[]> | undefined;

  filesUpdate$: Observable<any[]> | undefined;

  //creation d'objet avec la liste des periodiques
  // @ts-ignore
  collection: Collection = {};

  id_collection: number = -1;

  //importer les fonctions global
  global: MethodesGlobal = new MethodesGlobal();

  conditionIdCollection=false;

  action='add';

  ifAdmin=false;

  display: FormControl = new FormControl("", Validators.required);

  formData = new FormData();

  modifImage=false;

  ancienImage='';

  urlId='';

  api = '/api/collections/uploud';

  file_list: Array<string> = [];

  showAlert = false;



  @ViewChild('closebutton') closebutton:any;

  constructor(private collectionService: CollectionService,
              private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              private _location: Location) {}

  ngOnInit(): void {
    //this.imageInfos = this.uploadService.getFiles();
    //ajout de niveau de securité
    this.ifAdmin=this.global.ifAdminFunction();
    //ajout de niveau de securité
    /*if(!this.global.ifAdminFunction()){
      this.router.navigate(['/not-acces']);
    }*/

    //recouperer le bon titre du bouton
    this.translate.get('btn.ajouter').subscribe((res: string) => {
      this.bouttonAction=res;
    });
    //afficher le bon bouton
    this.global.afficher('addBoutton');
    this.global.nonAfficher('saveBoutton');

    if(this.route.snapshot.paramMap.get("id")!='add'){
      this.id_collection = Number(this.route.snapshot.paramMap.get("id"));
      //prendre la fiche
      if(this.id_collection){
        this.remplireFiche(this.id_collection);
        this.conditionIdCollection=true;
        this.urlId='/collection/'+this.id_collection;
      }
    }

    if(this.route.snapshot.paramMap.get("id")=='add'){
      this.conditionIdCollection=false;
      this.action='add';
      this.id_collection=0;
    }

  }

  //return historique page
  backClicked() {
    this._location.back();
  }

  //remplire la fiche de periodique
  remplireFiche(id:number){
    //action update
    this.action='save'
    //recouperer le bon titre du bouton
    this.translate.get('Enregistrer').subscribe((res: string) => {
      this.bouttonAction=res;
    });
    //cacher le boutton add
    this.global.nonAfficher('addBoutton');
    this.global.afficher('saveBoutton');

    this.collections$ = this.consulter(id);
    // @ts-ignore
    this.collections$.subscribe(res => {
      //creation d'objet periodique
      this.collection =res[0];
    });
  }

  //fonction pour ajouter une fiche
  post(collection:Collection): void {
   this.collections$ = this.collectionService
      .post(collection);
  }

  //mise a jour du formulaire
  update(collection:Collection): void {
    this.collections$ = this.collectionService
      .update(collection);
    this.global.afficher('alert-modif');
  }

//supprimer un enregistrement
  delete(id: number): void {
    this.collections$ = this.collectionService
      .delete(id)
      .pipe(tap(() => (this.onFermeModal('collection'))));
  }
  //consulter une fiche
  consulter(id: number) {
    //console.log(id);
    return this.collectionService.consulter(id)
  }


//fonction pour valider
  onSubmit(f: NgForm) {

    // @ts-ignore
    let action=document.getElementById('action').value

    if(f.value.id_collection)
      this.collection.id_collection=f.value.id_collection

    this.collection.nom=''
    if(f.value.nom)
      this.collection.nom=f.value.nom

    this.collection.description=''
    if(f.value.description)
      this.collection.description=f.value.description

    //definir les champs obligatoire
    let donnesValider:any={'nom':this.collection.nom}

    switch (action){
      case 'save':
        if(this.global.validationDonneesForm(donnesValider)){
          this.collection.id_collection=this.id_collection;
          this.onFermeModal('/collection/'+this.id_collection);
          this.update(this.collection);
        }
        break;
      case 'add':
        if(this.global.validationDonneesForm(donnesValider)){
          this.onFermeModal('collection');
          this.collection.id_collection=0;
          this.post({
            "id_collection":0,
            "nom":this.collection.nom,
            "description":this.collection.description
          })
        }
        break;
    }
  }

  //fermer le modal une fois envoyer les données
  onFermeModal(url: string) {
    this.showAlert = true;
    this.closebutton.nativeElement.click();
    // Attendre la fermeture du modal avant de naviguer
    setTimeout(() => {
      this.showAlert = false;
      this.router.navigateByUrl(url);
    }, 2000);
  }

}

