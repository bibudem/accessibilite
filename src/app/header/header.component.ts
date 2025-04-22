import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MethodesGlobal } from '../lib/MethodesGlobal';
import { PanierService } from '../services/panier.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  nomAdmin = '';
  prenomAdmin = '';
  groupeAdmin = '';
  flagChoix = 'flag-icon-fr';
  ifAdmin = false;
  currentDate = new Date();
  global = new MethodesGlobal();

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    private router: Router,
    public panierService: PanierService
  ) {}

  async ngOnInit() {
    // Vérifier et gérer la redirection s'il y a un URL à rediriger
    const storedRedirectUrl = localStorage.getItem('redirectUrl');
    if (storedRedirectUrl?.startsWith('/lien/')) {
      localStorage.removeItem('redirectUrl');
      window.location.href = storedRedirectUrl;
      //this.router.navigateByUrl(storedRedirectUrl)
      return;
    }

    await this.loadAdminInfo(this.router.url); // Charger les infos admin
    this.initUI(); // Initialiser les paramètres d'interface utilisateur
  }

  /** Initialisation des paramètres UI */
  private initUI() {
    this.translate.setDefaultLang('fr'); // Langue par défaut
    this.flagChoix = 'flag-icon-fr'; // Sélectionner le drapeau français
    this.ifAdmin = this.global.ifAdminFunction(); // Déterminer si l'utilisateur est administrateur
  }

  /** Charge les informations de l'administrateur depuis le LocalStorage ou effectue une connexion */
  private async loadAdminInfo(redirectUrl: string) {
    if (!this.authService.roleUser) {
      await this.login(redirectUrl); // Effectuer la connexion si nécessaire
    }
    this.nomAdmin = localStorage.getItem('nom') || '';
    this.prenomAdmin = localStorage.getItem('prenom') || '';
    this.groupeAdmin = localStorage.getItem('roleUser') || '';
  }

  /** Effectue la connexion et charge les informations de l'administrateur */
  private async login(redirectUrl: string) {
    try {
      const loginSuccess = await (await this.authService.login(redirectUrl)).toPromise(); // Convertir Observable en Promise
      loginSuccess ? this.loadAdminInfo(redirectUrl) : this.logout();
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      this.logout();
    }
  }

  /** Déconnexion de l'utilisateur */
  public async logout() {
    await this.authService.logout();
  }

  /** Changer la langue de l'application */
  switchLanguage(language: string) {
    this.translate.use(language);
    this.flagChoix = language === 'en' ? 'flag-icon-us' : `flag-icon-${language}`;
  }
}
