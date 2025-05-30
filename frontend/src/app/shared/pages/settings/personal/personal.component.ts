import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProfileCardComponent } from '../profile-card/profile-card.component';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [ProfileCardComponent],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalComponent {}
