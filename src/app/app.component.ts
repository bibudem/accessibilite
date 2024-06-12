import {Component, OnInit, HostListener} from '@angular/core';
import { AuthService } from './services/auth.service';
import { InactivityService } from './services/inactivity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'projet-accessibilite';
  isUserLinkRoute: boolean = false;
  flagChoix: string = 'flag-icon-fr';
  ifAdmin: boolean = true;

  constructor(
    public authService: AuthService,
    private inactivityService: InactivityService
  ) {
    // Initialisation du timer d'inactivité
    this.inactivityService.initInactivityTimer();
  }

  // Consolidation des événements utilisateur en une seule déclaration de HostListener
  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  @HostListener('document:scroll')
  handleUserActivity() {
    this.inactivityService.resetInactivityTimer();
  }

  ngOnInit() {
    this.handleUserActivity();
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
