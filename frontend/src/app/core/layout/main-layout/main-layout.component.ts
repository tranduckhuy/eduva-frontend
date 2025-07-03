import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { GlobalModalHostComponent } from '../../../shared/components/global-modal-host/global-modal-host.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule,
    ConfirmDialogModule,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    GlobalModalHostComponent,
  ],
  template: `
    <app-header />

    <main class="flex sm:h-auto sm:flex-col-reverse sm:items-center">
      <app-navbar />

      <div
        class="my-[18px] w-[calc(100%-100px)] px-7 sm:w-full sm:grow sm:px-4 sm:pb-20">
        <router-outlet />
      </div>
    </main>

    <app-footer />

    <p-toast />
    <p-confirmdialog [baseZIndex]="1000" />
    <app-global-modal-host />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {}
