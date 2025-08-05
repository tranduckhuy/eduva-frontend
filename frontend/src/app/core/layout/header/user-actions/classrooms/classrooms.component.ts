import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';

import { SubmenuDirective } from '../../../../../shared/directives/submenu/submenu.directive';
import { ClassService } from '../../../../../shared/services/api/class/class.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'header-classrooms',
  standalone: true,
  imports: [
    SubmenuDirective,
    ButtonModule,
    TooltipModule,
    RouterLink,
    FontAwesomeModule,
  ],
  templateUrl: './classrooms.component.html',
  styleUrl: './classrooms.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassroomsComponent {
  readonly clickOutside = output<void>();

  private readonly libIcon = inject(FaIconLibrary);
  private readonly classService = inject(ClassService);
  private readonly router = inject(Router);

  readonly classes = this.classService.classes;

  constructor() {
    this.libIcon.addIcons(faCirclePlay);
  }

  redirectToClasses() {
    this.router.navigate(['/classes']);
    this.clickOutside.emit();
  }

  redirectToClass(classId: string) {
    this.router.navigate(['/classes', classId]);
    this.clickOutside.emit();
  }
}
