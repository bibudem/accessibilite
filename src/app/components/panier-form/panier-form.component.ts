import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {tap} from "rxjs/operators";
import {NgForm} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import { MethodesGlobal } from 'src/app/lib/MethodesGlobal';
import {ListeChoixOptions} from "src/app/lib/ListeChoixOptions";
import {ActivatedRoute, Router} from "@angular/router";
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {Location} from "@angular/common";
import {Panier} from "../../models/Panier";
import {PanierService} from "../../services/panier.service";

@Component({
  selector: 'app-panier-form',
  templateUrl: './panier-form.component.html',
  styleUrls: ['./panier-form.component.css']
})
export class PanierFormComponent implements OnInit {
  panierDetails$: Observable<any[]> | undefined;

  panier$: Observable<any[]> | undefined;

  reponse = null;

  routeUrl = null;

  //importer les fonctions global
  global: MethodesGlobal = new MethodesGlobal();

  //importer les liste des choix
  listeChoixOptions: ListeChoixOptions = new ListeChoixOptions();

  panier: Panier = <Panier>{};

  @ViewChild('closebutton') closebutton:any;

  // @ts-ignore
  dataSource: MatTableDataSource<ListeItems>;
  placeholderDateAc = 'yyyy-mm-jj';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              public panierService: PanierService,
              private _location: Location) { }

  ngOnInit(): void {
    this.routeUrl = window.location.origin+'/lien/';
  }

  //fonction pour inserer un panier
  postPanier(panier: Panier): void {
    this.panier$ = this.panierService.post(panier)
      .pipe(
        tap(() => {
          this.postPanierDetails(this.panierService.getPanier());
        })
      );
  }

  //fonction pour inserer les details du panier
  postPanierDetails(panierDetails:any): void {
    this.panierDetails$ = this.panierService
      .postPanierDetails(panierDetails)
      .pipe(
        tap((response) => {
          this.reponse = response[0];
          //console.log('Réponse du backend :', response);
          this.panierService.clearPanierLocalStorage();
        })
      );
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
    for (const key in this.panier) {
      if (f.value.hasOwnProperty(key)) {
        if (key === 'dateActivation') {
          this.panier.dateActivation = this.global.convertDateObjectToString(f.value[key]).toString();
          let dateExpiration = new Date(this.panier.dateActivation);
          dateExpiration.setDate(dateExpiration.getDate() + Number(f.value['nbrJours']));
          this.panier.dateExpiration = this.global.convertDateStandartToString(dateExpiration);
        } else {
          this.panier[key] = f.value[key];
        }
      }
    }

    const donneesValider: any = {
      'sujet': this.panier.sujet,
      'nom': this.panier.nom,
      'prenom': this.panier.prenom,
      'courriel': this.panier.courriel,
      'dateActivation': this.panier.dateActivation,
      'nbrJours': this.panier.nbrJours
    };

    if (this.global.validationDonneesForm(donneesValider)) {
      this.panier.cle = 'bibUdeM-' + this.global.generateRandomString(40);
      this.onFermeModal();
      this.panier.admin = localStorage.getItem('courrielAdmin');

      try {
        this.postPanier({
          idPanier: 0,
          "sujet": this.panier.sujet,
          "nom": this.panier.nom,
          "prenom": this.panier.prenom,
          "courriel": this.panier.courriel,
          "statut": 'Actif',
          "cle": this.panier.cle,
          "dateActivation": this.panier.dateActivation,
          "nbrJours": this.panier.nbrJours,
          "dateExpiration": this.panier.dateExpiration,
          "note": this.panier.note || null,
          "admin": this.panier.admin
        });

      } catch (error) {
        console.error('Error posting panier:', error);
      }
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
