import { RouterOutlet } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';

import { PageTitleService } from './shared/services/page-title/page-title.service';
import { ThemeService } from './shared/services/theme/theme.service';

import { TailwindIndicatorComponent } from './shared/components/tailwind-indicator/tailwind-indicator.component';
import { NetworkStateComponent } from './shared/components/network-state/network-state.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TailwindIndicatorComponent, NetworkStateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly pageTitleService = inject(PageTitleService);

  constructor() {
    inject(ThemeService);
    this.pageTitleService.init();
  }
}
