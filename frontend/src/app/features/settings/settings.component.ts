import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly router = inject(Router);

  goBack(): void {
    window.dispatchEvent(new Event('close-all-submenus'));
    this.router.navigate(['/']);
  }
}
