import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen: boolean = false;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.hostElementRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  constructor(private hostElementRef: ElementRef) {}
}
