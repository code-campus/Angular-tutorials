import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCopyright]'
})
export class CopyrightDirective {

  date = new Date();
  year = this.date.getFullYear();

  constructor(private el: ElementRef) {
    this.el.nativeElement.innerHTML = '&copy '+ this.year +' all right reserved.';
  }

}
