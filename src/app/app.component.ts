import {Component, OnInit} from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor( public authService: AuthService) {

  }
  title = 'projet-accessibilite';
  isUserLinkRoute: boolean = false;
  flagChoix:string= 'flag-icon-fr';
  ifAdmin = true;

  ngOnInit() {
    // Étape 1: Stocker l'URL actuelle dans le service de redirection
    const path = window.location.pathname;
    this.authService.redirectUrl = path;
    switch (path) {
      case '/not-user':
        this.ifAdmin = false;
        break;
      default:
        if (this.isUserLinkRoute = path.startsWith('/lien/')) {
          this.ifAdmin = false;
        } else {
          // Effacer également le redirectUrl de la session
          localStorage.removeItem('redirectUrl');
        }
    }
  }


}
