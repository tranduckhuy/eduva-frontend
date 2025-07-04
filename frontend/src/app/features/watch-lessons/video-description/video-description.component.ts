import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'video-description',
  standalone: true,
  imports: [],
  templateUrl: './video-description.component.html',
  styleUrl: './video-description.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDescriptionComponent {
  readonly description = input.required<string>();
}
