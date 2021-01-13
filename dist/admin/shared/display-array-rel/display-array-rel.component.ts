import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-array-rel',
  template: `
    <span><span *ngIf="field"><strong>{{field}}: </strong></span>
      <span *ngFor="let object of value; let i = index" [attr.data-index]="i">
        <a [routerLink]="['/admin', className, object._id]">{{object[displayKey]}}</a><span *ngIf="i !== value.length - 1">, </span>
      </span>
    </span>
  `,
  styles: [`

  `],
})
export class DisplayArrayRelComponent {
  @Input() field: string;
  @Input() displayKey: string;
  @Input() className: string;
  @Input() value: any;
}
