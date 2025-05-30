import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-button-outline-gradient',
  standalone: true,
  imports: [TooltipModule],
  templateUrl: './button-outline-gradient.component.html',
  styleUrl: './button-outline-gradient.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonOutlineGradientComponent {
  tooltipText = input<string>();
  imgSrc = input.required<string>();

  mouseClick = output();

  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent) {
    event.stopPropagation();
    this.mouseClick.emit();
  }
}
