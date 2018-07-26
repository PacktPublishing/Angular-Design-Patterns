import { Directive, Input, ElementRef, HostListener  } from '@angular/core';

@Directive({
  selector: '[AngularPre]'
})
export class AngularPreDirective {

  @Input()
  highlightColor:string;

  constructor(private el: ElementRef) {
      el.nativeElement.style.border = "1px solid black";
      el.nativeElement.style.backgroundColor = this.highlightColor;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
