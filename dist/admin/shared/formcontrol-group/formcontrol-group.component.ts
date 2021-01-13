import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-formcontrol-group',
  template: `
    <div class="form-group" class="row">
      <label class="col-sm-2 control-label">{{displayName}}</label>
      <div [formGroup]="form" class="col-sm-10">
        <div [formGroupName]="field">
          <div *ngFor="let key of schemaKeys">
            <div class="form-group">
              <label class="col-sm-2 control-label">{{key}}</label>
              <div class="col-sm-10">
                <input type="text" [formControlName]="key" class="form-control" readonly="{{disabled}}">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`

  `],
})
export class FormcontrolGroupComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() field: string;
  @Input() displayName: string;
  @Input() schema: any;
  @Input() disabled: boolean;
  schemaKeys: any[];

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.schemaKeys = Object.keys(this.schema.paths);
  }

}
