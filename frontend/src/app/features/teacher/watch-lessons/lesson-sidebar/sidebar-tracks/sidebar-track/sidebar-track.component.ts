import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'primeng/tooltip';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faFileLines, faCirclePlay } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'sidebar-track',
  standalone: true,
  imports: [CommonModule, TooltipModule, FontAwesomeModule],
  templateUrl: './sidebar-track.component.html',
  styleUrl: './sidebar-track.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarTrackComponent implements OnInit {
  trackId = input.required<string>();

  libIcon = inject(FaIconLibrary);
  isExpanded = signal<boolean>(false);

  constructor() {
    this.libIcon.addIcons(faCircleCheck, faFileLines, faCirclePlay);
  }

  ngOnInit(): void {
    const stored = localStorage.getItem(this.getStorageKey());
    this.isExpanded.set(stored !== null ? JSON.parse(stored) : false);
  }

  toggleExpand() {
    const newState = !this.isExpanded();
    this.isExpanded.set(newState);
    localStorage.setItem(this.getStorageKey(), JSON.stringify(newState));
  }

  private getStorageKey(): string {
    return `expanded-${this.trackId}`;
  }
}
