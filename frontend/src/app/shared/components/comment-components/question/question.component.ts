import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { ImageModule } from 'primeng/image';

import { SubmenuDirective } from '../../../directives/submenu/submenu.directive';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';

import { UserService } from '../../../services/api/user/user.service';

import { type Question } from '../../../models/entities/question.model';

@Component({
  selector: 'comment-question',
  standalone: true,
  imports: [DatePipe, SubmenuDirective, SafeHtmlPipe, ImageModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent {
  private readonly userService = inject(UserService);

  question = input.required<Question | null>();

  user = this.userService.currentUser;

  isOptionsOpen = signal<boolean>(false);

  toggleFooterOptions() {
    this.isOptionsOpen.set(!this.isOptionsOpen());
  }

  closeFooterOptions() {
    this.isOptionsOpen.set(false);
  }
}
