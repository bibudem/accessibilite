import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-user',
  templateUrl: './not-user.component.html',
  styleUrls: ['./not-user.component.css'],
})
export class NotUserComponent implements OnInit {
  urlConnexion = '/api/user-udem/login';
  // Vrai au retour de la connexion Microsoft quand le compte n'a pas de page d'accueil (étudiant)
  connecte = false;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
    this.connecte = new URLSearchParams(window.location.search).get('connecte') === '1';
    // Si l'utilisateur arrivait d'un lien de partage, y revenir après la connexion
    const lienRetour = localStorage.getItem('lienRetour');
    if (lienRetour && /^\/lien\/[A-Za-z0-9-]+$/.test(lienRetour)) {
      this.urlConnexion += '?returnTo=' + encodeURIComponent(lienRetour);
    }
    //console.log('not-user '+localStorage.getItem('redirectUrl'));
    //console.log('lienFichier '+localStorage.getItem('lienFichier'));
  }
}
