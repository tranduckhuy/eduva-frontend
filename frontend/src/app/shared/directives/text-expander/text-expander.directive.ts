import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appTextExpander]',
  standalone: true,
})
export class TextExpanderDirective implements OnInit {
  @Input('appTextExpander') maxLength = 100;
  private originalText = '';
  private isCollapsed = true;
  private seeMoreBtn!: HTMLElement;
  private textSpan!: HTMLElement;

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit() {
    this.originalText = this.el.nativeElement.textContent.trim();
    this.renderer.setProperty(this.el.nativeElement, 'textContent', '');

    const container = this.renderer.createElement('span');
    this.renderer.setStyle(container, 'white-space', 'normal');
    this.renderer.setStyle(container, 'display', 'inline');

    this.textSpan = this.renderer.createElement('span');
    this.renderer.appendChild(container, this.textSpan);

    this.seeMoreBtn = this.renderer.createElement('span');
    this.renderer.setStyle(this.seeMoreBtn, 'color', '#0056d6');
    this.renderer.setStyle(this.seeMoreBtn, 'cursor', 'pointer');
    this.renderer.setStyle(this.seeMoreBtn, 'margin-left', '4px');
    this.renderer.setStyle(this.seeMoreBtn, 'white-space', 'nowrap');

    this.renderer.listen(this.seeMoreBtn, 'click', () => {
      this.isCollapsed = !this.isCollapsed;
      this.updateText();
    });

    this.renderer.appendChild(container, this.seeMoreBtn);
    this.renderer.appendChild(this.el.nativeElement, container);

    this.updateText();
  }

  private updateText() {
    const text = this.isCollapsed
      ? this.originalText.slice(0, this.maxLength) + '...'
      : this.originalText;

    this.renderer.setProperty(this.textSpan, 'textContent', text);
    this.renderer.setProperty(
      this.seeMoreBtn,
      'textContent',
      this.isCollapsed ? 'Xem thêm' : 'Thu gọn'
    );
  }
}
