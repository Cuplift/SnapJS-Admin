import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-array',
  template: `
    <span *ngIf="value">{{value.join(', ')}}</span>
  `,
  styles: [`

  `],
})
export class DisplayArrayComponent {
  @Input() field: string;
  @Input() value: any;
}
