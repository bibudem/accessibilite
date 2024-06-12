import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private inactivityTimeout: any;
  private readonly inactivityDuration = 30 * 60 * 1000; // 30 minutes

  constructor(private authService: AuthService, private router: Router, private ngZone: NgZone) {}

  public initInactivityTimer(): void {
    this.clearInactivityTimeout();
    this.setInactivityTimeout();
  }

  private setInactivityTimeout(): void {
    this.inactivityTimeout = this.ngZone.runOutsideAngular(() => {
      return setTimeout(() => {
        this.ngZone.run(() => {
          this.authService.logout();
        });
      }, this.inactivityDuration);
    });
  }

  public resetInactivityTimer(): void {
    this.clearInactivityTimeout();
    this.setInactivityTimeout();
  }

  private clearInactivityTimeout(): void {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
  }
}
