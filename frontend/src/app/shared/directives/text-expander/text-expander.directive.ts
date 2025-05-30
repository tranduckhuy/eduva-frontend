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

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit() {
    this.originalText = this.el.nativeElement.textContent.trim();
    if (this.originalText.length > this.maxLength) {
      this.setCollapsedText();
      this.addSeeMoreButton();
    }
  }

  private setCollapsedText() {
    const truncated = this.originalText.slice(0, this.maxLength) + '... ';
    this.renderer.setProperty(this.el.nativeElement, 'textContent', truncated);
  }

  private setFullText() {
    this.renderer.setProperty(
      this.el.nativeElement,
      'textContent',
      this.originalText + ' '
    );
  }

  private addSeeMoreButton() {
    this.seeMoreBtn = this.renderer.createElement('span');
    this.renderer.setStyle(this.seeMoreBtn, 'color', '#0056d6');
    this.renderer.setStyle(this.seeMoreBtn, 'cursor', 'pointer');
    this.renderer.setProperty(this.seeMoreBtn, 'textContent', 'Xem thêm');
    this.renderer.appendChild(this.el.nativeElement, this.seeMoreBtn);

    this.renderer.listen(this.seeMoreBtn, 'click', () => {
      this.isCollapsed = !this.isCollapsed;
      if (this.isCollapsed) {
        this.setCollapsedText();
        this.renderer.setProperty(this.seeMoreBtn, 'textContent', 'Xem thêm');
      } else {
        this.setFullText();
        this.renderer.setProperty(this.seeMoreBtn, 'textContent', 'Thu gọn');
      }
      this.renderer.appendChild(this.el.nativeElement, this.seeMoreBtn);
    });
  }
}
