import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavbarComponent, FooterComponent],
  template: `
    <app-header />

    <main class="flex sm:h-auto sm:flex-col-reverse sm:items-center">
      <app-navbar />

      <div
        class="mt-[18px] w-[calc(100%-100px)] px-7 sm:w-full sm:grow sm:px-4 sm:pb-20">
        <router-outlet />
      </div>
    </main>

    <app-footer />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {}
