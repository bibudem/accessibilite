// admin-guard.service.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  async canActivate(): Promise<boolean> {
    await this.authService.login();

    if (this.authService.isLoggedIn && this.authService.roleUser === 'Admin') {
      return true;
    } else {
      this.router.navigate(['/not-user']);
      return false;
    }
  }
}
