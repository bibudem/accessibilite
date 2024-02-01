// user-auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.authService.login();
    localStorage.setItem('redirectUrl', this.authService.redirectUrl);
    if (this.authService.isLoggedIn && (this.authService.roleUser === 'User' || this.authService.roleUser === 'Admin')) {
      return true;
    } else {
      window.location.href = '/not-user' ;
      //this.router.navigate(['/not-user']);
      return false;
    }
  }
}
