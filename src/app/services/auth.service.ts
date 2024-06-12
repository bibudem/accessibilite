// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';


@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;
  roleUser: string = '';
  user: User = { courriel: '', groupe: '', nom: '', prenom: '' };
  redirectUrl: string | null = null;

  constructor(private http: HttpClient) {}

  async login(redirectUrl?: string): Promise<boolean> {
    // Vérifier si les données sont déjà présentes dans le LocalStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.isLoggedIn = true;
      this.roleUser = this.user.groupe;
      return true;
    }

    try {
      // Charger les données depuis le serveur
      const res: any = await this.http.get<User>(`/api/user-udem`, { responseType: 'json' }).toPromise();

      if (res.length === 0) {
        await this.logout();
        return false;
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

      return true;

    } catch (error) {
      console.error('Erreur login http', error);
      await this.logout();
      return false;
    }
  }


  async logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('user'); // Supprimer les données du LocalStorage
    localStorage.removeItem('nom');
    localStorage.removeItem('prenom');
    localStorage.removeItem('courriel');
    localStorage.removeItem('roleUser');

    // Effacer également le redirectUrl de la session
    localStorage.removeItem('redirectUrl');

    window.location.href = '/not-user';
  }

}
