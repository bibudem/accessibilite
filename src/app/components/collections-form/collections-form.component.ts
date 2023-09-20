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
import { ListeChoixOptions } from "src/app/lib/ListeChoixOptions";
import { Collection } from "../../models/Collection";
import { FormControl, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileUploadService } from '../../services/file-upload.service';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';



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

  file_store: FileList | undefined;

  formData = new FormData();

  isFile$: Observable<any[]> | undefined;
  isFile=false;

  modifImage=false;

  ancienImage='';

  urlId='';

  api = 'http://localhost:9100/collections/uploud';

  file_list: Array<string> = [];



  @ViewChild('closebutton') closebutton:any;
  @ViewChild('f_input') myInputVariable: ElementRef | undefined;

  constructor(private collectionService: CollectionService,
              private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              private _location: Location,
              private http: HttpClient,
              private uploadService: FileUploadService) {}

  ngOnInit(): void {
    //this.imageInfos = this.uploadService.getFiles();
    //ajout de niveau de securité
    this.ifAdmin=this.global.ifAdminFunction();
    //ajout de niveau de securité
    /*if(!this.global.ifAdminFunction()){
      this.router.navigate(['/not-acces']);
    }*/

    //recouperer le bon titre du bouton
    this.translate.get('btn-ajouter').subscribe((res: string) => {
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
    //changer le texte pour le boutton
    //recouperer le bon titre du bouton
    this.translate.get('btn-enregistrer').subscribe((res: string) => {
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
      //verifier si l'image exist
      this.isFile$=this.collectionService.getFile(this.collection.image);
      this.isFile$.toPromise().then(res =>{
        if(res!== undefined){
          console.log(res[0]);
          if(res[0]==1){
            this.isFile=true;
          }

        }
      })
      this.ancienImage=this.collection.image;
    });
  }
  handleFileInputChange(l: FileList | null): void {
    if(l!=null){
      this.file_store = l;
      if (l.length) {
        const f = l[0];
        const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
        this.display.patchValue(`${f.name}${count}`);
      } else {
        this.display.patchValue("");
      }
    }
  }

  handleSubmit(): void {
    this.file_list = [];
    let nameFile = new Date().getHours().toLocaleString()+'_img_collection_';

    if(this.file_store!==undefined){
      for (let i = 0; i < this.file_store.length; i++) {
        nameFile+=this.file_store[i].name
        this.formData.append("thumbnail", this.file_store[i], nameFile);
        this.file_list.push(this.file_store[i].name);
        this.collection.image=nameFile;
      }
    }
  }

  //annuler le file selectioné
  viderFile(event:any){
    if(this.myInputVariable!==undefined)
      this.myInputVariable.nativeElement.value = '';
    if(document.getElementById('label-name-file')!==null)
       { // @ts-ignore
         document.getElementById('label-name-file').value='';
       }
  }

  //supprimer le file attaché
  deleteFile(fileName:string){
    this.global.nonAfficher('img-collection');
    this.filesUpdate$ =  this.collectionService.deleteFile(fileName);
    this.filesUpdate$.toPromise().then(res =>{
      if(res!== undefined){
        this.formData.delete("thumbnail");
        this.collection.image='';
      }
    })
  }

  //fonction pour ajouter une fiche
  post(collection:Collection): void {
    if(this.formData.has("thumbnail")){
      this.collectionService.upload(this.formData);
    }
   this.collections$ = this.collectionService
      .post(collection);
  }

  //mise a jour du formulaire
  update(collection:Collection): void {
    if(this.formData.has("thumbnail")){
      this.collectionService.upload(this.formData);
    }
    this.collections$ = this.collectionService
      .update(collection);
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

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
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

    this.collection.image=''
    if(f.value.image)
      this.collection.image=f.value.image

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
            "description":this.collection.description,
            "image":this.collection.image,
          })
        }
        break;
    }
  }

  //fermer le modal une fois envoyer les données
  onFermeModal(url:string) {
    let that=this;
    that.closebutton.nativeElement.click();
    setTimeout(function(){
      that.reload(url);
    }, 1500);
  }

}

