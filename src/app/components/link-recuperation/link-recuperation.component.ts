import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LinkService } from '../../services/link.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {MethodesGlobal} from "../../lib/MethodesGlobal";

@Component({
  selector: 'app-link-recuperation',
  templateUrl: './link-recuperation.component.html',
  styleUrls: ['./link-recuperation.component.css']
})
export class LinkRecuperationComponent implements OnInit {
  items$: Observable<any[]> | undefined;
  infosItems: any[] = [];
  key = '';
  flagChoix: string = 'flag-icon-fr';
  listeItems: any = [];
  lienFichier: string = '';
  userConnect: string = '';

  nom: string = '';
  prenom: string = '';

  //importer les fonctions global
  global: MethodesGlobal = new MethodesGlobal();

  constructor(
    private linkService: LinkService,
    private _location: Location,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.global.nonAfficher('alertNotUser');
    // Étape 1: Initialiser le composant
    this.initializeComponent();
    // Étape 2: recouperer courriel user
    this.userConnect = localStorage.getItem('courriel');
    // Stocker redirectUrl dans la session s'il est fourni
    this.nom = localStorage.getItem('nom');
    this.prenom = localStorage.getItem('prenom');
  }

  // Méthode d'initialisation du composant
  private async initializeComponent(): Promise<void> {
    if (this.route.snapshot.paramMap.get('key')) {
      // Récupérer la clé depuis l'URL
      this.key = this.route.snapshot.paramMap.get('key')!.toString();

      // Récupérer les détails de l'item depuis le service
      await this.fetchItemDetails(this.key);

      // Configuration de la langue par défaut et du drapeau
      this.translate.setDefaultLang('fr');
      this.flagChoix = 'flag-icon-fr';
    }
  }

  // Méthode pour récupérer les détails de l'item depuis le service
  private async fetchItemDetails(key: string): Promise<void> {
    try {
      // Appeler le service pour récupérer les détails de l'item
      const res = await this.linkService.fetchAll(key).toPromise();
      if((this.userConnect===res[0].courriel) || localStorage.getItem('roleUser')==='Admin'){
        // Parcourir les résultats et créer une structure d'information
        for (let i = 0; i < res.length; i++) {
          const item = res[i];
          const infosItem = this.createInfosItem(item);
          this.listeItems.push(infosItem);
        }

      } else{
        this.global.afficher('alertNotUser');
      }


    } catch (err) {
      // Gérer les erreurs, par exemple, afficher un message d'erreur
      console.error(`Error: ${err.message}`);
    }
  }

  // Méthode pour créer la structure d'information à partir des détails de l'item
  private createInfosItem(item: any): any {
    return {
      "idPanier": item.idPanier,
      "nom": item.nom,
      "prenom": item.prenom,
      "courriel": item.courriel,
      "dateActivation": item.dateActivation,
      "dateExpiration": item.dateExpiration,
      "nbrJours": item.nbrJours,
      "idItem": item.idItem,
      "statut": item.statut,
      "titre": item.titre,
      "auteur": item.auteur,
      "file": item.file,
      "URL": item.URL,
    };
  }

  // Méthode pour valider les informations de l'item
  validerLesInfosItem(dateExpiration: string, idPanier: string): boolean {
    if (!this.isDateExpired(dateExpiration)) {
      return true;
    } else {
      // Gérer le statut expiré de l'item
      this.handleExpiredStatus(idPanier);
      return false;
    }
  }

  // Méthode pour gérer le statut expiré de l'item
  private handleExpiredStatus(id: string): void {
    try {
      // Mettre à jour le statut de l'item via le service
      this.items$ = this.linkService['updateStatus'](id);
    } catch (error) {
      // Gérer les erreurs, par exemple, afficher un message d'erreur
      console.error(`Erreur lors de la mise à jour du statut : ${error.message}`);
    }
  }

  // Méthode pour télécharger un fichier
  download(file: string, urlFile: string): void {
    const url = window.location.origin + '/assets/files/items/' + urlFile + '/' + file;
    this.linkService
      .download(url, this.key)
      .subscribe(blob => {
        // Ouvrir le fichier dans une nouvelle fenêtre
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank');
        URL.revokeObjectURL(objectUrl);
      });
  }

  // Méthode pour changer la langue
  switchLanguage(language: string): void {
    this.translate.use(language);
    this.flagChoix = `flag-icon-${language}`;
    if (language === 'en') {
      this.flagChoix = 'flag-icon-us';
    }
  }

  // Méthode pour vérifier si la date est expirée
  isDateExpired(expirationDate: string): boolean {
    const expiration = new Date(expirationDate);
    const now = new Date();
    return now > expiration;
  }

  clearRedirectUrl() {
    localStorage.removeItem('redirectUrl');
  }
}
