import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {tap} from "rxjs/operators";
import {NgForm} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import { MethodesGlobal } from 'src/app/lib/MethodesGlobal';
import {ActivatedRoute, Router} from "@angular/router";
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {Location} from "@angular/common";
import {Panier} from "../../models/Panier";
import {PanierService} from "../../services/panier.service";
import {ListeChoixOptions} from "../../lib/ListeChoixOptions";

@Component({
  selector: 'app-historique-details',
  templateUrl: './historique-details.component.html',
  styleUrls: ['./historique-details.component.css']
})
export class HistoriqueDetailsComponent implements OnInit {
  panierDetails$: Observable<any[]> | undefined;

  panier$: Observable<any[]> | undefined;

  //creation d'objet avec la liste des periodiques
  // @ts-ignore
  panierDetailsObj: any = {};
  panier: Panier = <Panier>{};
  idPanier: string | null | undefined ;
  idPanierDetails : string | null | undefined;
  idItem : string | null | undefined;
  listePanierDetails: any[] = [];

  //importer les fonctions global
  global: MethodesGlobal = new MethodesGlobal();

  //definir le text pour les boutons
  bouttonAction='';

  titreItem=localStorage.getItem('titreItem');
  courrielAdmin='';

  //importer les liste des choix
  listeChoixOptions: ListeChoixOptions = new ListeChoixOptions();

  action='save';
  @ViewChild('closebutton') closebutton:any;

  // @ts-ignore
  dataSource: MatTableDataSource<ListeItems>;
  routeUrl='';
  placeholderDateAc = '';
  placeholderDateEx= '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              public panierService: PanierService,
              private _location: Location) { }

  ngOnInit(): void {
    // Afficher ou cacher les boutons et div de notification
    this.global.afficher('add-boutton-note');
    this.global.nonAfficher('save-boutton-note');
    this.global.nonAfficher('alert-add-note');

    // Récupérer le courriel de l'administrateur depuis localStorage
    this.courrielAdmin = localStorage.getItem('courriel');

    // Récupérer l'ID de l'item depuis la route ou localStorage
    this.idPanier = this.route.snapshot.paramMap.get("id") || localStorage.getItem('idItem');

    // Appeler la fonction pour créer le tableau
    this.creerTableau();
    // @ts-ignore
    this.routeUrl=window.location.origin;

  }

  //fonction doit etre async pour attendre la reponse de la bd
  async creerTableau() {
    try {
      //recouperer le bon titre du bouton
      this.translate.get('btn-ajouter').subscribe((res: string) => {
        this.bouttonAction=res;
      });
      if (this.idPanier != null) {
        this.panierDetails$ = await this.consulter(this.global.convertNumber(this.idPanier));
        await this.panierDetails$.toPromise().then(res => {
          for (let i = 0; i < res.length; i++) {
            this.listePanierDetails[i]={
              "numero":i+1,
              "item_titre":res[i].item_titre,
              "item_auteur":res[i].item_auteur,
              "item_editeur":res[i].item_editeur,
              "idDetails":res[i].idDetails,
              "idItem":res[i].idItem,
              "date":res[i].dateA
            }
          }
            this.panier.idPanier=Number(this.idPanier);
            this.panier.sujet=res[0].sujet;
            this.panier.nom=res[0].nom;
            this.panier.prenom=res[0].prenom;
            this.panier.courriel=res[0].courriel;
            this.panier.statut=res[0].statut;
            this.panier.cle=res[0].cle;
            this.panier.note=res[0].note;
            this.panier.dateActivation=res[0].dateActivation;
            this.panier.nbrJours=res[0].nbrJours;
            this.panier.dateExpiration=res[0].dateExpiration;
            this.placeholderDateAc = res[0].dateActivation;
            this.placeholderDateEx = res[0].dateExpiration;
            this.dataSource = new MatTableDataSource(this.listePanierDetails);
        });
      }
    } catch(err) {
      console.error(`Error : ${err.Message}`);

    }
  }


  //retour sur le profil periodique
  goBack(): void {
    //retour sur la page de suivi d'un item
    this.router.navigate(['/panier/'+this.idPanier]);
  }

  update(panier: any): void {
    this.global.nonAfficher('save-boutton');

    this.panier$ = this.panierService
      .update(panier)
      .pipe(
        tap(() => {
          console.log("Mise à jour réussie.");
          // Afficher la notification puis naviguer
          this.afficherNotification('/historique/' + this.idPanier);

          // Utilisez directement navigate() après la mise à jour
          this.router.navigate(['/historique/' + this.idPanier]).then(() => {
            console.log("Redirection réussie après mise à jour.");
          });
        })
      );
  }


  delete(id: number): void {
      this.panier$ = this.panierService
        .delete(id)
      //afficher notification
      this.global.afficher('alert-sup');
      let that=this;
      setTimeout(function(){
        that.global.nonAfficher('alert-sup');
        that.reload('/historique-list');
      }, 1500);
}

  //recouperer la liste des periodiques
  consulter(idPanier: number): Observable<any[]> {
    return this.panierService.consulter(idPanier);
  }

  //reload la page
  async reload(url: string): Promise<boolean> {
    // Remplacer cette navigation intermédiaire par une seule navigation directe
    return this.router.navigate([url]);
  }

  //afficher notification ensuite recharger la page
  afficherNotification(url: string) {
    // Afficher la notification
    this.global.afficher('alert-add');

    let that = this;
    setTimeout(function() {
      that.global.nonAfficher('alert-add');

      // Utiliser la navigation Angular plutôt que de recharger la page
      that.router.navigate([url]).then(() => {
        console.log(`Redirection réussie vers ${url} après notification.`);
      });
    }, 2000);
  }


  onSubmit(f: NgForm) {
    const champs: any = {
      idPanier : this.idPanier,
      sujet: '',
      nom : '',
      prenom: '',
      courriel: '',
      statut : '',
      note: '',
      cle: ''
    };

    for (let key in champs) {
      if (f.value[key]) {
          champs[key] = f.value[key];
      }
    }
    this.panier=champs;
    this.panier.dateActivation = this.global.convertDateObjectToString(f.value['dateActivation']).toString();
    let dateExpiration = new Date(this.panier.dateActivation);
    dateExpiration.setDate(dateExpiration.getDate() + Number(f.value['nbrJours']));
    this.panier.nbrJours=f.value['nbrJours'];
    this.panier.dateExpiration = this.global.convertDateStandartToString(dateExpiration);
    this.panier.admin=this.courrielAdmin;

    let donneesValider: any = { 'nom': this.panier.nom,'prenom': this.panier.prenom, 'courriel': this.panier.courriel };

    if (this.global.validationDonneesForm(donneesValider)) {
      this.onFermeModal();
      this.update(this.panier);
      // Changez la redirection ici, en supprimant le setTimeout et en utilisant directement `navigate`
      this.router.navigate(['/historique/' + this.idPanier]).then(() => {
        console.log("Redirection réussie après soumission du formulaire.");
      });
    }
  }

  modifierCle(){
    // @ts-ignore
    document.getElementById('cle').value='bibUdeM-'+this.global.generateRandomString(40);
    // @ts-ignore
    this.panier.cle=document.getElementById('cle').value;
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
