import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {LinkService} from "../../services/link.service";
import {MethodesGlobal} from "../../lib/MethodesGlobal";
import { Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-link-recuperation',
  templateUrl: './link-recuperation.component.html',
  styleUrls: ['./link-recuperation.component.css']
})

export class LinkRecuperationComponent implements OnInit{

  //importer les fonctions global
  global: MethodesGlobal = new MethodesGlobal();

  titreItem = '';

  items$: Observable<any[]> | undefined;

  infosItems:any = [];

  key = '';

  linkActif = false;

  //durré de validité de lien en jours
  validePerodide = 30;// en jours

  lienItem='';

  nameItem='';

  constructor(private linkService : LinkService,
              private _location: Location,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get("key")){
      this.key = this.route.snapshot.paramMap.get("key").toString();
       //reccuperer les données
       this.infosItem(this.key);
     }
  }

  //fonction doit etre async pour attendre la reponse de la bd
  async infosItem(key: string) {
    try {

      const res = await this.linkService.fetchAll(key).toPromise();
      if (res && res.length > 0) {
        const item = res[0];

        const infosItems = {
          "idSuivi": item.idSuivi,
          "nom": item.nom,
          "prenom": item.prenom,
          "courriel": item.courriel,
          "dateActivation": item.dateActivation,
          "idItem": item.id,
          "statut": item.statut,
          "titre": item.titre,
          "file": item.file,
          "URL": item.URL,
        };
        this.lienItem=item.URL+'/'+ item.file;
        this.nameItem=this.global.dateSimple()+item.file;
        this.validerLesInfosItem(infosItems);
      } else {
        // Gérer le cas où res est vide ou undefined (redirection, message d'erreur, etc.)
        // this.redirect();
      }
    } catch (err) {
      console.error(`Error: ${err.message}`);
      // Gérer l'erreur ici, par exemple, afficher un message d'erreur à l'utilisateur
    }
  }

  validerLesInfosItem(infos: any) {
    if (infos.statut !== 'Actif') {
      return; // Sortir de la fonction si le statut n'est pas actif
    }

    const dateDonnee: Date = new Date(infos.dateActivation);
    const differenceEnJours: number = (Date.now() - dateDonnee.getTime()) / (1000 * 60 * 60 * 24);

    // vérifier si c'est le bon user
    const courrielConnexion = sessionStorage.getItem('courrielConnexion');
    const courrielAdmin = sessionStorage.getItem('courrielAdmin');

    if (differenceEnJours < this.validePerodide) {
      if (courrielConnexion !== infos.courriel && !courrielAdmin) {
        window.location.href = '/not-access';
      }
      if (courrielAdmin) {
        this.titreItem = infos.titre;
        this.linkActif = true;
      }
      this.titreItem = infos.titre;
      this.linkActif = true;
    } else {
      this.handleExpiredStatus(infos.idSuivi);
    }
  }


  handleExpiredStatus(idSuivi: number) :void {
    try {
      this.items$ = this.linkService['updateStatus'](idSuivi);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut : ${error.message}`);
      // Gérer l'erreur ici, par exemple, afficher un message d'erreur à l'utilisateur
    }
  }

  downloadFile(file, name){
    let link = document.createElement("a");
    link.download = name;
    link.href = window.location.origin + '/assets/files/items/' + file;
    link.click();
  }

  download(file, name): void {
    let url=window.location.origin + '/assets/files/items/' + file;
    this.linkService
      .download(url,this.key)
      .subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = name;
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
  }


}
