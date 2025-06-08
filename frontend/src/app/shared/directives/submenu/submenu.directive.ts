import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  output,
} from '@angular/core';

@Directive({
  selector: '[clickOutsideSubmenu]',
  standalone: true,
})
export class SubmenuDirective {
  private readonly elRef = inject(ElementRef);

  clickOutside = output<void>();

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const path = event.composedPath();
    if (!path.includes(this.elRef.nativeElement)) {
      this.clickOutside.emit();
    }
  }
}
