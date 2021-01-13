import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-text',
  template: `
    <span><strong *ngIf="field">{{field}}:</strong> {{isDate ? (value | date: "MM/dd/yyyy h:mma") : value}}</span>
  `,
  styles: [`

  `],
})
export class DisplayTextComponent {
  @Input() field: string;
  @Input() value: any;
  @Input() isDate: boolean;
}
