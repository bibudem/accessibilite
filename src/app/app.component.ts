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

  // Utilisation d'un seul HostListener avec un tableau d'événements pour la gestion de l'inactivité
  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  @HostListener('document:scroll')
  onUserActivity() {
    this.inactivityService.resetInactivityTimer();
  }

  ngOnInit() {
    this.trackRouteState();
  }

  private trackRouteState() {
    const path = window.location.pathname;
    this.authService.redirectUrl = path;
    // Configuration des conditions de route
    const adminRoutes = ['/', '/admin', '/historique-list'];
    const dynamicAdminRoutes = ['/items/','/items', '/collection/'];

    if (path === '/not-user') {
      this.ifAdmin = false;
    } else if (path.startsWith('/lien/')) {
      this.isUserLinkRoute = true;
      localStorage.setItem('redirectUrl', path);
      this.ifAdmin = false;
    } else if (adminRoutes.includes(path) || dynamicAdminRoutes.some(route => path.startsWith(route))) {
      localStorage.removeItem('redirectUrl');
    }
  }
}
