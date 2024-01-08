import {Component, Inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message: string = 'Vous êtes déconnecté !';
  courriel: string | undefined;
  password: string | undefined;
  isLoggedIn:boolean=false

  constructor(public authService: AuthService,
              public router: Router) { }

  async ngOnInit() {
    await this.login();
    //chercher le nom de la session
  }

  // Connecte l'utilisateur auprès du Guard

  async login() {
        // @ts-ignore
        (await this.authService.login()).subscribe(() => {
          if (this.authService.isLoggedIn) {
            // Si aucune redirection n'a été définis, redirige l'utilisateur vers la page d'accueil.
            let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/login';
            // Redirige l'utilisateur
            this.router.navigate([redirect]);
          } else {
            this.logout()
          }
        });
  }

  // Logout l'utilisateur
  async logout() {
    await this.authService.logout();
  }


}
