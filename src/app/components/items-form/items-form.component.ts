import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MethodesGlobal } from 'src/app/lib/MethodesGlobal';
import { Item } from 'src/app/models/Item';
import { ItemService } from 'src/app/services/item.service';
import { Location } from '@angular/common';
import {PanierService} from "../../services/panier.service";
import {ListeChoixOptions} from "../../lib/ListeChoixOptions";

@Component({
  selector: 'app-items-form',
  templateUrl: './items-form.component.html',
  styleUrls: ['./items-form.component.css']
})
export class ItemsFormComponent implements OnInit {
  // Titre du bouton
  bouttonAction = '';

  items$: Observable<any[]> | undefined;

  filesUpdate$: Observable<any[]> | undefined;

  // Création d'un objet avec les données de l'item
  // @ts-ignore
  item: Item = {};

  idItem: number = -1;

  // Import des fonctions globales
  global: MethodesGlobal = new MethodesGlobal();

  //importer les liste des choix
  lstOptions: ListeChoixOptions = new ListeChoixOptions();

  conditionIdItem = false;

  action = 'add';

  ifAdmin = false;

  file_store: FileList | undefined;

  formData = new FormData();

  isFile$: Observable<any[]> | undefined;

  display: FormControl = new FormControl("", Validators.required);

  isFile = false;

  file_list: Array<string> = [];

  ancienImage = '';

  urlId = '';

  listeCollection: any = [];

  currentURL = '';

  newURL = '';

  arrayAnnee: any = [];

  lstTypeDocument: any = [];

  lstLangue: any = [];

  lstFormatSubstitut: any = [];

  lstDocComplet: any = [];

  lstVisuelAccessible: any = [];

  routeUrl = '';

  showAlert = false;

  // Import des suivis
  suivi$: Observable<any> | undefined;
  tableauSuivi: any = [];

  isLoading=false;

  @ViewChild('closebutton') closebutton: any;

  @ViewChild('f_input') myInputVariable: ElementRef | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private _location: Location,
    private itemService: ItemService,
    private panierService: PanierService,
  ) { }

  ngOnInit(): void {
    // Ajout de niveau de sécurité
    this.ifAdmin = true;
    this.routeUrl = window.location.origin;
    // Récupérer le bon titre du bouton
    this.translate.get('Ajouter').subscribe((res: string) => {
      this.bouttonAction = res;
    });

    // Afficher le bon bouton
    this.global.afficher('addBoutton');
    this.global.nonAfficher('saveBoutton');

    if (this.route.snapshot.paramMap.get("id") != 'add') {
      this.idItem = Number(this.route.snapshot.paramMap.get("id"));
      localStorage.setItem('idItem', this.idItem.toString());

      // Prendre la fiche
      if (this.idItem) {
        this.remplireFiche(this.idItem);
        this.conditionIdItem = true;
        this.urlId = '/items/' + this.idItem;
        localStorage.setItem('idItem', this.idItem.toString());
      }

      this.creerTableauSuivi(this.idItem);
    }

    // Année
    this.arrayAnnee = this.global.anneeOptions();

    // Options dynamiques de la liste des collections
    this.global.optionsDynamiques(this.listeCollection, this.itemService.fetchAllCollection());

    if (this.route.snapshot.paramMap.get("id") == 'add') {
      this.conditionIdItem = false;
      this.action = 'add';
      this.idItem = 0;
    }
  }

  // Remplir la fiche de l'item
  remplireFiche(id: number) {
    // Action de mise à jour
    this.action = 'save';

    // Changer le texte pour le bouton
    this.translate.get('Enregistrer').subscribe((res: string) => {
      this.bouttonAction = res;
    });

    // Cacher le bouton "Ajouter"
    this.global.nonAfficher('addBoutton');
    this.global.afficher('saveBoutton');

    this.items$ = this.consulter(id);

    // Récupération des données de l'item
    this.items$.subscribe(res => {
      // Création de l'objet item
      this.item = res[0];
      localStorage.setItem('titreItem', this.item.titre);

      // Vérifier si l'image existe
      this.isFile$ = this.itemService.getFile(this.item.file, this.item.URL);

      this.isFile$.toPromise().then(res => {
        if (res !== undefined) {
          if (res[0] == 1) {
            this.isFile = true;
          }
        }
      });

      this.ancienImage = this.item.file;

      // URL du fichier
      this.currentURL = this.routeUrl+'/assets/files/items/' + this.item.URL;
    });
  }

  // Consulter une fiche
  consulter(id: number) {
    //console.log(id);
    return this.itemService.consulter(id);
  }

  handleFileInputChange(l: FileList | null): void {
    if (l != null) {
      this.file_store = l;
      if (l.length) {
        const f = l[0];
        const count = l.length > 1 ? `(+${l.length - 1} fichiers)` : "";
        this.display.patchValue(`${f.name}${count}`);
      } else {
        this.display.patchValue("");
      }
    }
  }

  handleSubmit(): void {
    this.file_list = [];
    let nameFile = new Date().getHours().toLocaleString() + '_item_';
    let nameFolder = this.item.idColecttion + this.global.generateRandomNumber(10);

    if (this.file_store !== undefined) {
      for (let i = 0; i < this.file_store.length; i++) {
        nameFile += this.global.cleanFileName(this.file_store[i].name);
        this.formData.append("file", this.file_store[i], nameFile);
        this.formData.append("nameFolder", nameFolder);
        this.file_list.push(this.file_store[i].name);
        this.file_list.push(nameFolder);
        this.item.file = nameFile;
        this.item.URL = nameFolder;
      }
    }
  }

  // Annuler le fichier sélectionné
  viderFile(event: any) {
    if (this.myInputVariable !== undefined)
      this.myInputVariable.nativeElement.value = '';
    if (document.getElementById('label-name-file') !== null) {
      // @ts-ignore
      document.getElementById('label-name-file').value = '';
    }
  }

  // Supprimer le fichier attaché
  deleteFile(fileName: string, folder: string) {
    this.filesUpdate$ = this.itemService.deleteFile(fileName, folder);

    this.filesUpdate$.toPromise().then(res => {
      if (res !== undefined) {
        this.formData.delete("file");
        this.item.file = '';
      }
    });
    this.onFermeModal();
  }

  // Mise à jour de l'URL
  updateURL(id: number, ancienURL: string) {
    let newUrl = this.global.generateRandomString(40);
    this.global.nonAfficher('img-collection');
    this.filesUpdate$ = this.itemService.updateUrl(id.toString(), ancienURL, newUrl);

    this.filesUpdate$.toPromise().then(res => {
      if (res !== undefined) {
        this.global.afficher('img-collection');
        this.router.navigateByUrl('/items/' + this.idItem);
      }
    });
  }

  // Fonction pour ajouter un item
  async post(item: Item) {
    if (this.formData.has("file")) {
      const file = this.formData.get("file") as File;
      if (file && file.size > 300 * 1024 * 1024) { // 300 Mo en octets
        this.isLoading = true;
        await this.itemService.upload(this.formData);
        this.closebutton.nativeElement.click();
        await this.delay(10000); // Pause de 10 secondes
        this.isLoading = false;
      }else {
        await this.itemService.upload(this.formData);
      }
    }
    this.items$ = this.itemService.post(item);
    this.onFermeModal();

  }

  // Mise à jour du formulaire
  async update(item: Item) {
    if (this.formData.has("file")) {
      const file = this.formData.get("file") as File;
      if (file && file.size > 300 * 1024 * 1024) { // 300 Mo en octets
        this.isLoading = true;
        await this.itemService.upload(this.formData);
        this.closebutton.nativeElement.click();
        await this.delay(10000); // Pause de 10 secondes
        this.isLoading = false;
      } else {
        await this.itemService.upload(this.formData);
      }
    }
    this.items$ = this.itemService.update(item);
    this.onFermeModal();
  }

  // Fonction utilitaire pour ajouter un délai (pause)
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Supprimer un enregistrement
  delete(id: number, fileName:string, folder:string ): void {
    this.filesUpdate$ = this.itemService.deleteFile(fileName, folder);

    this.filesUpdate$.toPromise().then(res => {
      if (res !== undefined) {
        this.formData.delete("file");
        this.item.file = '';
      }
    });

    this.items$ = this.itemService.delete(id).pipe(tap(() => {
      localStorage.removeItem('textFiltre');
      this.router.navigateByUrl('/items');
    }));

  }

  // Fonction pour valider le formulaire
  onSubmit(f: NgForm) {
    // @ts-ignore
    const action = document.getElementById('action').value;
    const champs: any = {
      idItem: this.idItem,
      idColecttion: '',
      typeDocument: '',
      auteur: '',
      annee: '',
      titre: '',
      editeur: '',
      edition: '',
      isbn: '',
      format: '',
      visuelAccessibles: '',
      documentComplet: '',
      description: '',
      note: '',
      langue: '',
      file: '',
      URL: '',

    };

    for (let key in champs) {
      if (f.value[key]) {
        champs[key] = f.value[key];
      }
    }

    this.item = champs;

    // Définir les champs obligatoires
    let donneesValider: any = {'titre': this.item.titre, 'idColecttion': this.item.idColecttion,'typeDocument': this.item.typeDocument };

    switch (action) {
      case 'save':
        if (this.global.validationDonneesForm(donneesValider)) {
          this.update(this.item);
        }
        break;
      case 'add':
        if (this.global.validationDonneesForm(donneesValider)) {
          this.post(this.item);
        }
        break;
    }
  }
  //tableau des archives
  async creerTableauSuivi(id: number) {
    try {
      this.suivi$ = this.panierService.listeHistorique(id);
      await this.suivi$.toPromise().then(res => {
        for (let i = 0; i < res.length; i++) {
          this.tableauSuivi[i]={
            "numero":i+1,
            "nom":res[i].nom,
            "prenom":res[i].prenom,
            "courriel":res[i].courriel,
            "statut":res[i].statut,
            "dateActivation":res[i].dateActivation,
            "dateExpiration":res[i].dateExpiration
          }
        }
        console.log(this.tableauSuivi);
      });
    } catch(err) {
      console.error(`Error : ${err.Message}`);
    }
  }
  // Fermer le modal une fois les données envoyées
  onFermeModal() {
    this.showAlert = true;
    this.closebutton.nativeElement.click();
    // Attendre la fermeture du modal avant de naviguer
    setTimeout(() => {
      this.showAlert = false; // Masquez l'alerte
      this.reloadPage();
    }, 3000);

  }


  // Retourner à la page précédente
  backClicked() {
    this._location.back();
  }

  // Utilisez le service pour effectuer des opérations sur le panier
  addToPanier(item: any) {
    this.panierService.addToPanier(item);
  }

  reloadPage() {
    const currentPath = this.router.url;
    if (currentPath === '/items/add') {
      localStorage.setItem('textFiltre',this.item.titre);
      this.router.navigateByUrl('/items');
    } else {
      // Pour d'autres chemins, re-naviguer vers la même route
      window.location.reload();
    }

  }
}
