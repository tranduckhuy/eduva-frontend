import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthModalComponent } from '../../../shared/components/auth-modal/auth-modal.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    AuthModalComponent,
  ],
  template: `
    <app-header />

    <main
      class="flex min-h-[100vh] sm:h-auto sm:flex-col-reverse sm:items-center">
      <app-navbar />

      <div
        class="mt-[18px] w-[calc(100%-100px)] px-7 sm:w-full sm:grow sm:px-4 sm:pb-20">
        <router-outlet />
      </div>
    </main>

    <app-footer />

    <app-auth-modal />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {}
