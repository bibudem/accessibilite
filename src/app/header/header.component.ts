// header.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MethodesGlobal } from '../lib/MethodesGlobal';
import { PanierService } from '../services/panier.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  nomAdmin: string = '';
  prenomAdmin: string = '';
  groupeAdmin: string = '';
  flagChoix: string = 'flag-icon-fr';
  ifAdmin: boolean = false;
  currentDate = new Date();
  global: MethodesGlobal = new MethodesGlobal();

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    public router: Router,
    public panierService: PanierService
  ) {}

  async ngOnInit() {
    // Redirectioner un user pour le lien
    if(localStorage.getItem('redirectUrl') && localStorage.getItem('redirectUrl').startsWith('/lien/')){
      let redirectUrl = localStorage.getItem('redirectUrl');
      // Effacer également le redirectUrl de la session
      localStorage.removeItem('redirectUrl');
      window.location.href = redirectUrl ;
    }
    const redirectUrl = this.router.url;
    await this.loadAdminInfo(redirectUrl);
    this.translate.setDefaultLang('fr');
    this.flagChoix = 'flag-icon-fr';
    this.ifAdmin = this.global.ifAdminFunction();
  }

  async loadAdminInfo(redirectUrl: string) {
    if (!this.authService.roleUser) {
      await this.login(redirectUrl);
    }
    this.nomAdmin = localStorage.getItem('nom') || '';
    this.prenomAdmin = localStorage.getItem('prenom') || '';
    this.groupeAdmin = localStorage.getItem('roleUser') || '';
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.flagChoix = `flag-icon-${language}`;
    if (language === 'en') {
      this.flagChoix = 'flag-icon-us';
    }
  }

  async login(redirectUrl: string) {
    try {
      const loginSuccess: boolean = await this.authService.login(redirectUrl);

      if (loginSuccess) {
        await this.loadAdminInfo(redirectUrl);
      } else {
        await this.logout();
      }
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      await this.logout();
    }
  }

  async logout() {
    await this.authService.logout();
  }
}
