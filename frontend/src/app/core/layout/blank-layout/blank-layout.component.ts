import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { GlobalModalHostComponent } from '../../../shared/components/global-modal-host/global-modal-host.component';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule,
    ConfirmDialogModule,
    GlobalModalHostComponent,
  ],
  template: `
    <router-outlet />

    <p-toast />
    <p-confirmdialog [baseZIndex]="1000" />
    <app-global-modal-host />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlankLayoutComponent {}
