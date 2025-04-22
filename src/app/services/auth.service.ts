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

  constructor(private http: HttpClient,
              private router: Router,) {}

  async login(redirectUrl?: string): Promise<Observable<boolean>> {
    let isLoggedIn: boolean;
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
                window.location.href = storedRedirectUrl;
                //this.router.navigateByUrl(storedRedirectUrl)
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
        });
    } catch (e: any) {
      isLoggedIn = false;
      await this.logout();
      console.log('Erreur login http' + e);
    }

    return of(true).pipe(
      delay(100),
      tap((val) => (this.isLoggedIn = isLoggedIn))
    );
  }

  async logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('user');
    localStorage.removeItem('nom');
    localStorage.removeItem('prenom');
    localStorage.removeItem('courriel');
    localStorage.removeItem('roleUser');

    window.location.href = '/api/logout';
  }

  /** Redirects to the specified external link with the mediation of the router */
  public redirect(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        // @ts-ignore
        //this.window.location.href = url;
        this.router.navigateByUrl(url);
      } catch (e) {
        reject(e);
      }
    });
  }
}
