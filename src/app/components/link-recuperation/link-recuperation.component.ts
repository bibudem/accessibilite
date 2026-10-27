// Import des modules nécessaires
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LinkService } from '../../services/link.service';
import { firstValueFrom, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// États possibles de la page, chacun avec son propre message
type EtatPage = 'chargement' | 'documents' | 'aucunDocument' | 'sessionExpiree' | 'erreur';

// Libellés lisibles des formats de fichier (annoncés aussi aux lecteurs d'écran)
const FORMATS: { [ext: string]: string } = {
  pdf: 'PDF', doc: 'Word', docx: 'Word', txt: 'Texte', rtf: 'Texte enrichi (RTF)',
  xls: 'Excel', xlsx: 'Excel', csv: 'Tableur (CSV)', ppt: 'PowerPoint', pptx: 'PowerPoint',
  mp3: 'Audio MP3', wav: 'Audio WAV', ogg: 'Audio OGG', zip: 'Archive ZIP',
  jpg: 'Image JPEG', jpeg: 'Image JPEG', png: 'Image PNG', gif: 'Image GIF', svg: 'Image SVG',
};

@Component({
  selector: 'app-link-recuperation',
  templateUrl: './link-recuperation.component.html',
  styleUrls: ['./link-recuperation.component.css']
})
export class LinkRecuperationComponent implements OnInit {
  // Déclaration des propriétés de la classe
  stateUpdate$: Observable<any[]> | undefined;
  key = '';
  listeItems: any[] = [];
  userConnect: string = '';
  nom: string = '';
  prenom: string = '';
  isLoading: boolean = false;
  etat: EtatPage = 'chargement';
  // Message court annoncé par les lecteurs d'écran quand le contenu change
  annonce = '';
  // Message affiché quand un téléchargement échoue
  erreurTelechargement = '';
  // Bouton à l'origine de l'erreur, pour y ramener le focus quand on ferme le message
  private dernierBouton: HTMLElement | null = null;

  @ViewChild('contenu') contenu: ElementRef<HTMLElement> | undefined;

  // Constructeur avec injection de dépendances
  constructor(
    private linkService: LinkService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
  ) {}

  // Méthode d'initialisation du composant
  ngOnInit(): void {
    this.title.setTitle('Vos documents adaptés – Bibliothèques UdeM');
    this.translate.setDefaultLang('fr');
    // Récupérer l'utilisateur connecté avant de charger les documents
    this.userConnect = localStorage.getItem('courriel') || '';
    this.nom = localStorage.getItem('nom') || '';
    this.prenom = localStorage.getItem('prenom') || '';
    this.key = this.route.snapshot.paramMap.get('key') || '';
    if (this.key) {
      this.fetchItemDetails(this.key);
    } else {
      this.changerEtat('aucunDocument');
    }
  }

  // Méthode pour récupérer les détails de l'item depuis le service
  async fetchItemDetails(key: string): Promise<void> {
    this.changerEtat('chargement');
    try {
      const res = await firstValueFrom(this.linkService.fetchAll(key));

      // Le serveur ne renvoie que les paniers de l'utilisateur ; on garde la vérification côté client
      const autorise = res[0] && (
        this.userConnect.toLowerCase() === (res[0].courriel || '').toLowerCase() ||
        localStorage.getItem('roleUser') === 'Admin');

      if (!autorise) {
        this.changerEtat('aucunDocument');
        return;
      }

      // Lien expiré : marquer le panier inactif, puis recharger pour afficher le nouveau statut
      if (this.isDateExpired(res[0].dateExpiration) && res[0].statut != 'Inactif') {
        this.stateUpdate$ = this.linkService.updateStateLink(res[0].idPanier);
        this.stateUpdate$.toPromise().then(r => {
          if (r !== undefined) {
            this.reload('/lien/' + this.key);
          }
        });
      }

      this.listeItems = res.map(item => this.createInfosItem(item));
      this.changerEtat('documents');
    } catch (err: any) {
      console.error(`Error: ${err?.message}`);
      this.changerEtat(err?.status === 401 ? 'sessionExpiree' : 'erreur');
    }
  }

  // Met à jour l'état de la page et le message annoncé aux lecteurs d'écran
  private changerEtat(etat: EtatPage): void {
    this.etat = etat;
    const disponibles = this.listeItems.filter(i => !i.expire).length;
    const annonces: { [e in EtatPage]: string } = {
      chargement: 'Chargement de vos documents…',
      documents: disponibles === 0
        ? 'Aucun document téléchargeable : le lien a expiré.'
        : `${disponibles} document${disponibles > 1 ? 's' : ''} disponible${disponibles > 1 ? 's' : ''} au téléchargement.`,
      aucunDocument: 'Aucun document associé à votre compte pour ce lien.',
      sessionExpiree: 'Votre session a expiré.',
      erreur: "Impossible d'afficher vos documents.",
    };
    this.annonce = annonces[etat];
  }

  // Méthode pour créer la structure d'information à partir des détails de l'item
  private createInfosItem(item: any): any {
    return {
      idPanier: item.idPanier,
      courriel: item.courriel,
      dateExpiration: item.dateExpiration,
      dateExpirationTexte: this.formaterDate(item.dateExpiration),
      expire: this.isDateExpired(item.dateExpiration),
      idItem: item.idItem,
      statut: item.statut,
      titre: item.titre,
      auteur: item.auteur,
      file: item.file,
      URL: item.URL,
      format: this.formatFichier(item.file),
    };
  }

  // Méthode pour télécharger un fichier
  download(file: string, urlFile: string, event?: Event): void {
    this.isLoading = true; // Activer l'animation de chargement
    this.erreurTelechargement = '';
    this.dernierBouton = (event?.currentTarget as HTMLElement) || null;

    let param=file+'&'+urlFile;
    const url = `${window.location.origin}/api/items/file/${param}`;
    // Le navigateur télécharge directement (progression native) : l'animation ne couvre que la vérification
    this.linkService.telechargerFichier(url, file).subscribe({
      next: () => {
        this.isLoading = false; // Désactiver l'animation de chargement
      },
      error: (error) => {
        console.error('Error during file download:', error);
        this.isLoading = false; // Désactiver l'animation de chargement en cas d'erreur
        this.erreurTelechargement = this.linkService.messageErreurTelechargement(error.status);
      }
    });
  }

  // Ferme le message d'erreur et ramène le focus clavier sur le bouton concerné
  fermerErreur(): void {
    this.erreurTelechargement = '';
    this.dernierBouton?.focus();
  }

  // Lien d'évitement : déplace le focus sur le contenu principal sans changer d'URL
  allerAuContenu(event: Event): void {
    event.preventDefault();
    this.contenu?.nativeElement.focus();
  }

  recharger(): void {
    window.location.reload();
  }

  // Une date « AAAA-MM-JJ » seule est interprétée en heure locale (et non UTC, qui décalerait d'un jour)
  private lireDate(valeur: string): Date {
    const jourSeul = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valeur || '');
    return jourSeul ? new Date(+jourSeul[1], +jourSeul[2] - 1, +jourSeul[3]) : new Date(valeur);
  }

  // « 15 novembre 2026 » plutôt qu'une date technique, plus facile à lire et à entendre
  private formaterDate(valeur: string): string {
    const date = this.lireDate(valeur);
    return isNaN(date.getTime()) ? (valeur || '') : date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  private formatFichier(file: string): string {
    const ext = (file || '').split('.').pop()?.toLowerCase() || '';
    return FORMATS[ext] || (ext ? ext.toUpperCase() : 'Fichier');
  }

  // Méthode pour vérifier si la date est expirée
  isDateExpired(expirationDate: string): boolean {
    return new Date() > this.lireDate(expirationDate);
  }

  // Méthode pour recharger l'URL
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
}
