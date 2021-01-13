import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-formcontrol-array',
  template: `
    <div [formGroup]="form" class="form-group">
      <label class="col-sm-2 control-label">{{displayName}}</label>
      <div class="col-sm-10">
        <!-- <tag-input [modelAsStrings]="true" [formControlName]="field" class="form-control"></tag-input> -->
      </div>
    </div>
  `,
  styles: [`

  `],
})
export class FormcontrolArrayComponent {
  @Input() form: FormGroup;
  @Input() field: string;
  @Input() displayName: string;
}
