import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {tap} from "rxjs/operators";
import {NgForm} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import { MethodesGlobal } from 'src/app/lib/MethodesGlobal';
import {ActivatedRoute, Router} from "@angular/router";
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SuiviService } from 'src/app/services/suivi.service';
import {Location} from "@angular/common";
import {Suivi} from "../../models/Suivi";

@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.component.html',
  styleUrls: ['./suivi.component.css']
})
export class SuiviComponent implements OnInit {
  suivi$: Observable<any[]> | undefined;

  //creation d'objet avec la liste des periodiques
  // @ts-ignore
  suiviObj: Suivi = {};
  idSuivi=0 ;
  idItem : string | null | undefined;
  //les entêts du tableau
  displayedColumns = ['numero','nom', 'prenom','courriel','note','statut','dateA','dateM','modiffier','supprimer'];
  listeSuivi: any[] = [];

  //importer les fonctions global
  global: MethodesGlobal = new MethodesGlobal();

  //definir le text pour les boutons
  bouttonAction='';

  titreItem=localStorage.getItem('titreItem');
  courrielAdmin='';

  action='add'

  @ViewChild('closebutton') closebutton:any;

  // @ts-ignore
  dataSource: MatTableDataSource<ListeItems>;
  placeholderDateAc = 'yyyy-mm-jj';
  routeUrl='';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              private suiviService: SuiviService,
              private _location: Location) { }


  ngOnInit(): void {
    // Afficher ou cacher les boutons et div de notification
    this.global.afficher('add-boutton-note');
    this.global.nonAfficher('save-boutton-note');
    this.global.nonAfficher('alert-add-note');

    // Récupérer le courriel de l'administrateur depuis localStorage
    this.courrielAdmin = localStorage.getItem('courrielAdmin');

    // Récupérer l'ID de l'item depuis la route ou localStorage
    this.idItem = this.route.snapshot.paramMap.get("id") || localStorage.getItem('idItem');

    // Appeler la fonction pour créer le tableau
    this.creerTableau();
    this.routeUrl=window.location.origin;
  }

//fonction doit etre async pour attendre la reponse de la bd
  async creerTableau() {
    try {
      //recouperer le bon titre du bouton
      this.translate.get('btn-ajouter').subscribe((res: string) => {
        this.bouttonAction=res;
      });
      if (this.idItem != null) {
        this.suivi$ = await this.fetchAll(this.global.convertNumber(this.idItem));
        await this.suivi$.toPromise().then(res => {
          for (let i = 0; i < res.length; i++) {
            this.listeSuivi[i]={
              "numero":i+1,
              "idSuivi":res[i].idSuivi,
              "nom":res[i].nom,
              "prenom":res[i].prenom,
              "cle":res[i].cle,
              "courriel":res[i].courriel,
              "note":res[i].note,
              "statut":res[i].statut,
              "dateA":res[i].dateA,
              "dateM":res[i].dateM,
              "dateActivation":res[i].dateActivation
            }
          }

          this.dataSource = new MatTableDataSource(this.listeSuivi);
        });
      }
    } catch(err) {
      console.error(`Error : ${err.Message}`);
      //
    }
  }

  //appliquer modifier fiche
  apliquerModifier(id:number,idSuivi:string) {
    //cacher le boutton add
    this.global.nonAfficher('add-boutton');
    this.global.afficher('save-boutton');
    //changer l'action
    this.action='save';
    this.idSuivi=Number(idSuivi);
    this.suiviObj =this.listeSuivi[id];
    this.placeholderDateAc=this.listeSuivi[id].dateActivation;
    this.suiviObj.idSuivi=Number(idSuivi);
    //changer le texte pour le boutton
    this.translate.get('btn-enregistrer').subscribe((res: string) => {
      this.bouttonAction=res;
    });
  }

  //retour sur le profil periodique
  goBack(): void {
    //retour sur la page de suivi d'un item
    this.router.navigate(['/items/'+this.idItem]);
  }

  //fonction pour inserer
  post(suivi:Suivi): void {
    this.suivi$ = this.suiviService
      .post(suivi)
      .pipe(tap(() => (this.afficherNotification('suivi/'+this.idItem))));
  }

  update(suivi:Suivi): void {
    //cacher le bouton
    this.global.nonAfficher('save-boutton');

    this.suivi$ = this.suiviService
      .update(suivi)
      .pipe(tap(() => (this.afficherNotification('suivi/'+this.idItem))));

  }

  delete(id: number): void {
    let textAlert:string='';
    //changer le texte pour le boutton
    this.translate.get('message.supprimer-text').subscribe((res: string) => {
      textAlert=res;
    });
    if(window.confirm(textAlert)) {
      this.suivi$ = this.suiviService
        .delete(id)
        .pipe(tap(() => (this.suivi$ = this.fetchAll(id))));
      //afficher notification
      this.global.afficher('alert-sup');
      let that=this;
      setTimeout(function(){
        that.global.nonAfficher('alert-sup');
        that.reload('suivi/'+that.idItem);
      }, 2500);
    }
  }


  //recouperer la liste des periodiques
  fetchAll(idItem: number): Observable<any[]> {
    return this.suiviService.fetchAll(idItem);
  }

  //reload la page
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
  //afficher notification ensuite recharger la page
  afficherNotification(url:string){
    //afficher la notification
    this.global.afficher('alert-add');
    let that=this;
    setTimeout(function(){
      that.global.nonAfficher('alert-add');
      that.reload(url);
    }, 1000);
  }
  onSubmit(f: NgForm) {
    // @ts-ignore
    const action = document.getElementById('action').value;
    const champs: any = {
      idSuivi:this.idSuivi,
      idItem:this.idItem,
      nom : '',
      prenom: '',
      note: '',
      cle: '',
      courriel: '',
      statut : '',
      dateActivation : ''
    };

    for (let key in champs) {
      if (f.value[key]) {
        if(key=='dateActivation'){
          champs[key] = this.global.convertDateObjectToString(f.value[key]).toString();
        } else
           champs[key] = f.value[key];
      }
    }
    this.suiviObj=champs;

    let donneesValider: any = { 'nom': this.suiviObj.nom,'prenom': this.suiviObj.prenom, 'courriel': this.suiviObj.courriel, 'dateAc': this.suiviObj.dateActivation };
    switch (action) {
      case 'save':
        if (this.global.validationDonneesForm(donneesValider)) {
          this.onFermeModal();
          this.update(this.suiviObj);
          setTimeout(() => this.reload('/suivi/' + this.idItem), 1500);
        }
        break;
      case 'add':
        this.suiviObj.idSuivi=0;
        this.suiviObj.cle='bibUdeM-'+this.global.generateRandomString(40);
        if (this.global.validationDonneesForm(donneesValider)) {
          this.onFermeModal();
          this.suiviObj.admin=sessionStorage.getItem('courrielAdmin');
          this.post(this.suiviObj);
        }
        break;
    }
  }


  //fermer le modal une fois envoyer les données
  onFermeModal() {
    this.closebutton.nativeElement.click();
  }
  //return historique page
  backClicked() {
    this._location.back();
  }
}

