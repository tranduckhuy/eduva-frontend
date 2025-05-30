import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-redirect',
  standalone: true,
  template: '',
})
export class SettingsRedirectComponent implements OnInit, OnDestroy {
  private resizeListener = () => this.handleRedirect();

  constructor(private router: Router) {}

  ngOnInit() {
    this.handleRedirect();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  private handleRedirect() {
    if (window.matchMedia('(max-width: 991.98px)').matches) {
      this.router.navigate(['settings']);
    } else {
      this.router.navigate(['settings', 'personal']);
    }
  }
}
