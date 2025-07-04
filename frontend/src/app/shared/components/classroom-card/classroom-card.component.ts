import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faClock, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

import { TooltipModule } from 'primeng/tooltip';
import { ClassModel } from '../../models/entities/class.model';

@Component({
  selector: 'classroom-card',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule, TooltipModule],
  templateUrl: './classroom-card.component.html',
  styleUrl: './classroom-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassroomCardComponent {
  libIcon = inject(FaIconLibrary);

  classroom = input.required<ClassModel>();
  withProgress = input<boolean>(false);

  constructor() {
    this.libIcon.addIcons(faClock, faCirclePlay);
  }
}
