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
import { SuiviService } from "../../services/suivi.service";
import {PanierService} from "../../services/panier.service";

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

  routeUrl = '';

  // Import des suivis
  suivi$: Observable<any> | undefined;
  tableauSuivi: any = [];

  @ViewChild('closebutton') closebutton: any;

  @ViewChild('f_input') myInputVariable: ElementRef | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private _location: Location,
    private itemService: ItemService,
    private suiviService: SuiviService,
    private panierService: PanierService,
  ) { }

  ngOnInit(): void {
    // Ajout de niveau de sécurité
    this.ifAdmin = true;
    this.routeUrl = window.location.origin;
    // Récupérer le bon titre du bouton
    this.translate.get('btn.ajouter').subscribe((res: string) => {
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
    this.translate.get('btn-enregistrer').subscribe((res: string) => {
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
        nameFile += this.file_store[i].name;
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
        this.reload('/items/' + this.idItem);
      }
    });
  }

  // Mise à jour de l'URL
  updateURL(id: number, ancienURL: string) {
    let newUrl = this.global.generateRandomString(20);
    this.global.nonAfficher('img-collection');
    this.filesUpdate$ = this.itemService.updateUrl(id.toString(), ancienURL, newUrl);

    this.filesUpdate$.toPromise().then(res => {
      if (res !== undefined) {
        this.global.afficher('img-collection');
        this.reload('/items/' + this.idItem);
      }
    });
  }

  // Fonction pour ajouter un item
  post(item: Item): void {
    if (this.formData.has("file")) {
      this.itemService.upload(this.formData);
    }

    this.items$ = this.itemService.post(item);
  }

  // Mise à jour du formulaire
  async update(item: Item) {
    if (this.formData.has("file")) {
      await this.itemService.upload(this.formData);
    }

    this.items$ = this.itemService.update(item);
  }

  // Supprimer un enregistrement
  delete(id: number): void {
    this.items$ = this.itemService.delete(id).pipe(tap(() => (this.onFermeModal('items'))));
  }

  // Fonction pour valider le formulaire
  onSubmit(f: NgForm) {
    // @ts-ignore
    const action = document.getElementById('action').value;
    const champs: any = {
      idItem: this.idItem,
      titre: '',
      auteur: '',
      editeur: '',
      annee: '',
      description: '',
      file: '',
      URL: '',
      idColecttion: ''
    };

    for (let key in champs) {
      if (f.value[key]) {
        champs[key] = f.value[key];
      }
    }

    this.item = champs;

    // Définir les champs obligatoires
    let donneesValider: any = { 'titre': this.item.titre, 'idColecttion': this.item.idColecttion };

    switch (action) {
      case 'save':
        if (this.global.validationDonneesForm(donneesValider)) {
          this.onFermeModal('/items/' + this.idItem);
          this.update(this.item);
        }
        break;
      case 'add':
        if (this.global.validationDonneesForm(donneesValider)) {
          this.onFermeModal('/items');
          this.post(this.item);
        }
        break;
    }
  }
  //tableau des archives
  async creerTableauSuivi(id: number) {
    try {
      this.suivi$ = this.suiviService.fetchAll(id);
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
  onFermeModal(url: string) {
    this.closebutton.nativeElement.click();
    setTimeout(() => this.reload(url), 1500);
  }

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }

  // Retourner à la page précédente
  backClicked() {
    this._location.back();
  }

  // Utilisez le service pour effectuer des opérations sur le panier
  addToPanier(item: any) {
    this.panierService.addToPanier(item);
  }
}
