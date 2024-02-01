// auth-guard.service.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    if (!this.authService.isLoggedIn) {
      await this.authService.login();
    }

    if (this.authService.isLoggedIn) {
      return true;
    } else {
      // Utilisez la méthode getRedirectUrl de authService pour obtenir l'URL de redirection
      const redirectUrl = this.authService.redirectUrl || '/not-user';
      this.router.navigate([redirectUrl]);
      return false;
    }
  }
}
