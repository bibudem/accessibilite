import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { Observable, of } from 'rxjs';
import { tap, delay, catchError } from 'rxjs/operators';
import {Router} from "@angular/router";

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;
  roleUser: string = '';
  user: User = { courriel: '', groupe: '', nom: '', prenom: '' };
  redirectUrl: string | null = null;
  // Vrai quand on est en train de partir vers la connexion Microsoft :
  // les guards ne doivent alors plus rediriger ailleurs.
  redirectionConnexionEnCours = false;

  constructor(private http: HttpClient,
              private router: Router,) {}

  async login(redirectUrl?: string): Promise<Observable<boolean>> {
    let isLoggedIn: boolean;
    if (this.redirectionConnexionEnCours) {
      return of(false);
    }
    try {
      // Reconnecte le bon utilisateur
      await this.http
        .get<User>(`/api/user-udem`, { responseType: 'json' })
        .toPromise()
        .then((res: any) => {
          // Success
          if (res.length == 0) {
            isLoggedIn = false;
            this.logout();
          }
          this.user = res;
          this.isLoggedIn = true;
          this.roleUser = this.user.groupe;

          // Stocker les données dans le LocalStorage
          localStorage.setItem('user', JSON.stringify(this.user));
          localStorage.setItem('nom', this.user.nom);
          localStorage.setItem('prenom', this.user.prenom);
          localStorage.setItem('courriel', this.user.courriel);
          localStorage.setItem('roleUser', this.user.groupe);

          // Vérification du rôle de l'utilisateur et gestion de la redirection
          switch (this.user.groupe) {
            case 'Admin':
              localStorage.setItem('groupeAdmin', 'Gestionnaire');
              localStorage.setItem('role', 'Admin');
              const currentUrlLink = window.location.href;
              //console.log(currentUrlLink);
              localStorage.setItem('redirectUrl', currentUrlLink);
              this.redirectUrl = currentUrlLink;
              redirectUrl = currentUrlLink;
              const storedRedirectUrl = localStorage.getItem('redirectUrl');
              if (storedRedirectUrl?.startsWith('/lien/')) {
                localStorage.removeItem('redirectUrl');
                //console.log(storedRedirectUrl);
                //window.location.href = storedRedirectUrl;
                this.router.navigateByUrl(storedRedirectUrl)
                return;
              }
              break;

            case 'Viewer':
              localStorage.setItem('groupeAdmin', 'Bibliothécaire');
              localStorage.setItem('role', 'Viewer');
              break;

            default:
              const currentUrl = window.location.href;
              const lienFichier = currentUrl.includes('/lien/bibUdeM');
              if (!lienFichier) {
                isLoggedIn = false;
                return;
              }
              localStorage.setItem('redirectUrl', currentUrl);
              this.redirectUrl = currentUrl;
          }

          // Connexion réussie : la tentative de retour vers le lien est terminée
          sessionStorage.removeItem('tentativeConnexionLien');
          localStorage.removeItem('lienRetour');
        });
    } catch (e: any) {
      isLoggedIn = false;
      if (this.connecterPuisRevenirAuLien()) {
        return of(false);
      }
      await this.logout();
      console.log('Erreur login http' + e);
    }

    return of(true).pipe(
      delay(100),
      tap((val) => (this.isLoggedIn = isLoggedIn))
    );
  }

  /**
   * Sans session sur un lien de partage (ex. lien ouvert depuis Outlook dans un autre navigateur),
   * on envoie directement vers la connexion Microsoft en demandant au serveur d'y revenir ensuite.
   * Une seule tentative automatique par lien : si la session ne tient toujours pas au retour
   * (cookies bloqués…), on mémorise le lien pour le bouton « Connectez-vous » de /not-user.
   */
  private connecterPuisRevenirAuLien(): boolean {
    // Les guards de /lien/:key appellent login() en parallèle : si un autre appel a déjà
    // lancé la redirection, ne pas l'écraser par un logout().
    if (this.redirectionConnexionEnCours) {
      return true;
    }
    const chemin = window.location.pathname;
    if (!/^\/lien\/[A-Za-z0-9-]+$/.test(chemin)) {
      return false;
    }
    localStorage.setItem('lienRetour', chemin);
    if (sessionStorage.getItem('tentativeConnexionLien') === chemin) {
      return false;
    }
    sessionStorage.setItem('tentativeConnexionLien', chemin);
    this.redirectionConnexionEnCours = true;
    window.location.href = '/api/user-udem/login?returnTo=' + encodeURIComponent(chemin);
    return true;
  }

  async logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('user');
    localStorage.removeItem('nom');
    localStorage.removeItem('prenom');
    localStorage.removeItem('courriel');
    localStorage.removeItem('roleUser');
    localStorage.removeItem('redirectUrl');
    window.location.href = '/api/logout';
  }

  /** Redirects to the specified external link with the mediation of the router */
  public redirect(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        // @ts-ignore
        this.window.location.href = url;
        //this.router.navigateByUrl(url);
      } catch (e) {
        reject(e);
      }
    });
  }
}