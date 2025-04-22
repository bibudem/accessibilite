import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { InactivityService } from './services/inactivity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'projet-accessibilite';
  isUserLinkRoute = false;
  flagChoix = 'flag-icon-fr';
  ifAdmin = true;

  constructor(
    public authService: AuthService,
    private inactivityService: InactivityService
  ) {
    this.inactivityService.initInactivityTimer();
  }

  // Regroupement de tous les événements sous un seul HostListener
  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  @HostListener('document:scroll')
  onUserActivity(): void {
    this.inactivityService.resetInactivityTimer();
  }

  ngOnInit(): void {
    this.updateRouteState();
  }

  private updateRouteState(): void {
    const path = window.location.pathname;

    this.authService.redirectUrl = path;

    // Routes administrateur
    const adminRoutes = [
      '/', '/accueil', '/items', '/items/add', '/collection',
      '/historique-list', '/add-panier', '/historique/:id', '/items/:id', '/collection/:id'
    ];
    // Vérification si la route est administrateur ou utilisateur
    if (path === '/not-user') {
      this.ifAdmin = false;
      this.isUserLinkRoute = false;
    } else if (path.startsWith('/lien')) {
      this.isUserLinkRoute = true;
      localStorage.setItem('redirectUrl', path);
      //console.log(localStorage.getItem('redirectUrl'));
      this.ifAdmin = false;
    } else if (adminRoutes.some(route => path.startsWith(route.split(':')[0]))) {
      this.ifAdmin = true;
      this.isUserLinkRoute = false;
      //localStorage.removeItem('redirectUrl');
    } else {
      this.isUserLinkRoute = false;
      this.ifAdmin = false;
    }
  }
}
