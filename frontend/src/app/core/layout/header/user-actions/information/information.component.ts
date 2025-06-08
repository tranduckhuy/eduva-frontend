import { RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';

import { SubmenuDirective } from '../../../../../shared/directives/submenu/submenu.directive';

import { ThemeService } from '../../../../../shared/services/theme/theme.service';

@Component({
  selector: 'header-user-information',
  standalone: true,
  imports: [RouterLink, SubmenuDirective],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationComponent {
  private readonly themeService = inject(ThemeService);
  theme = this.themeService.theme;

  readonly clickOutside = output<void>();

  toggleTheme() {
    this.theme() === 'light'
      ? this.themeService.setTheme('dark')
      : this.themeService.setTheme('light');
  }
}
