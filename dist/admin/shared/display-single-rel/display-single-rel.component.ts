import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-single-rel',
  template: `
    <span><strong *ngIf="field">{{field}}:</strong> <a *ngIf="value" [routerLink]="['/admin', className, value._id]">{{value[displayKey] || value}}</a></span>
  `,
  styles: [`

  `],
})
export class DisplaySingleRelComponent {
  @Input() field: string;
  @Input() displayKey: string;
  @Input() className: string;
  @Input() value: any;
}
