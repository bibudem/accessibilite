import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MethodesGlobal } from '../lib/MethodesGlobal';
import {PanierService} from "../services/panier.service";

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
    public panierService: PanierService,
  ) {}

  async ngOnInit() {
    this.loadAdminInfo();
    this.translate.setDefaultLang('fr');
    this.flagChoix = 'flag-icon-fr';
    this.ifAdmin = this.global.ifAdminFunction();
  }

  async loadAdminInfo() {
    if (!localStorage.getItem('nomAdmin')) {
      await this.login();
    } else {
      this.nomAdmin = localStorage.getItem('nomAdmin') || '';
      this.prenomAdmin = localStorage.getItem('prenomAdmin') || '';
      this.groupeAdmin = localStorage.getItem('groupeAdmin') || '';
    }
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.flagChoix = `flag-icon-${language}`;
    if (language === 'en') {
      this.flagChoix = 'flag-icon-us';
    }
  }

  async login() {
    (await this.authService.login()).subscribe(() => {
      if (this.authService.isLoggedIn) {
        this.loadAdminInfo();
      } else {
        this.logout();
      }
    });
  }

  async logout() {
    await this.authService.logout();
  }
}
