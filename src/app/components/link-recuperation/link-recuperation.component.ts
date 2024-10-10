// Import des modules nécessaires
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LinkService } from '../../services/link.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MethodesGlobal } from '../../lib/MethodesGlobal';

@Component({
  selector: 'app-link-recuperation',
  templateUrl: './link-recuperation.component.html',
  styleUrls: ['./link-recuperation.component.css']
})
export class LinkRecuperationComponent implements OnInit {
  // Déclaration des propriétés de la classe
  stateUpdate$: Observable<any[]> | undefined;
  infosItems: any[] = [];
  key = '';
  flagChoix: string = 'flag-icon-fr';
  listeItems: any = [];
  lienFichier: string = '';
  userConnect: string = '';
  nom: string = '';
  prenom: string = '';

  // Import des fonctions globales
  global: MethodesGlobal = new MethodesGlobal();

  statutExpirate = false;
  idPanier = '';

  // Constructeur avec injection de dépendances
  constructor(
    private linkService: LinkService,
    private _location: Location,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // Méthode d'initialisation du composant
  ngOnInit(): void {
    // Étape 1: Initialiser le composant
    this.initializeComponent();
    // Étape 2: Récupérer le courriel de l'utilisateur connecté
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
      let res = await this.linkService.fetchAll(key).toPromise();

      // Vérifier si l'utilisateur a les droits d'accès
      if (
        this.userConnect === res[0].courriel ||
        localStorage.getItem('roleUser') === 'Admin'
      ) {
        // Vérifier les informations de l'item et mettre à jour si nécessaire
        if (res[0] && !this.validerLesInfosItem(res[0].dateExpiration)) {
          if (res[0].statut != 'Inactif') {
            this.stateUpdate$ = this.linkService.updateStateLink(
              res[0].idPanier
            );
            this.stateUpdate$.toPromise().then(res => {
              if (res !== undefined) {
                this.reload('/lien/' + this.key);
              }
            });
          }
        }

        // Parcourir les résultats et créer une structure d'information
        for (let i = 0; i < res.length; i++) {
          const item = res[i];
          this.idPanier = item.idPanier;
          const infosItem = this.createInfosItem(item);
          this.listeItems.push(infosItem);
        }
      } else {
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
      idPanier: item.idPanier,
      nom: item.nom,
      prenom: item.prenom,
      courriel: item.courriel,
      dateActivation: item.dateActivation,
      dateExpiration: item.dateExpiration,
      nbrJours: item.nbrJours,
      idItem: item.idItem,
      statut: item.statut,
      titre: item.titre,
      auteur: item.auteur,
      file: item.file,
      URL: item.URL
    };
  }

  // Méthode pour valider les informations de l'item
  validerLesInfosItem(dateExpiration: string): boolean {
    return !this.isDateExpired(dateExpiration);
  }

  // Méthode pour télécharger un fichier
  download(file: string, urlFile: string): void {
    const url = `${window.location.origin}/assets/files/items/${urlFile}/${file}`;
    this.linkService.download(url, this.key).subscribe((blob: Blob) => {
        // Create a URL for the blob object
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = file;
        document.body.appendChild(a);
        a.click();

        // Revoke the object URL after download is complete
        URL.revokeObjectURL(objectUrl);
        a.remove();
      },
      error => {
        console.error('Error during file download:', error);
      }
    );
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

  // Méthode pour effacer l'URL de redirection
  clearRedirectUrl() {
    localStorage.removeItem('redirectUrl');
  }

  // Méthode pour recharger l'URL
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
}
