import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-formcontrol-array-rel',
  template: `
    <div [formGroup]="form" class="row">
      <label class="col-sm-2 control-label">{{displayName}}</label>
      <div [formArrayName]="field" class="col-sm-10">
        <div *ngFor="let item of form['controls'][field]['controls']; let i = index; ">
          <div class="col-sm-offset-2 col-sm-10">
            <span>Item {{i + 1}}</span>
            <span *ngIf="form['controls'][field]['controls'].length > 1 && !disabled" (click)="removeItem(i)">Remove</span>
          </div>

          <div *ngFor="let key of schemaKeys" [formGroupName]="i" class="form-group">
            <label class="col-sm-2 control-label">{{key}}</label>
            <div class="col-sm-10">
              <input
                type="{{getInputType(key)}}"
                [formControlName]="key"
                class="form-control"
                readonly="{{disabled}}"
                [checked]="form['controls'][field]['controls'][i]['controls'][key].value"
                (change)="updateFormValue(form['controls'][field]['controls'][i]['controls'][key].value, key, getInputType(key), i)">
              <div [hidden]="form['controls'][field]['controls'][i]['controls'][key].valid" class="text-danger">This is required</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-offset-2 col-sm-10" *ngIf="!disabled">
        <a (click)="addItem()">
          Add another item +
        </a>
      </div>
    </div>
  `,
  styles: [`

  `],
})
export class FormcontrolArrayRelComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() object: {};
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

    // Remove _id from schemaKeys if it exists
    const idIndex = this.schemaKeys.indexOf('_id');
    if (idIndex > -1) {
      this.schemaKeys.splice(idIndex, 1);
    }

    if (this.object[this.field]) {
      this.object[this.field].map((item) => {
        this.addItem(item);
      });
    }
  }

  initItem(item: any = {}) {
    const formGroup = this.formBuilder.group({});

    this.schemaKeys.forEach((key) => {
      formGroup.registerControl(key, new FormControl(item[key] || ''));
    });

    return formGroup;
  }

  addItem(item: any = {}) {
    const control = <FormArray>this.form.get(this.field);
    control.push(this.initItem(item));
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.get(this.field);
    control.removeAt(i);
  }

  /**
   * Get the input type based on the subdocument field instance coming back from schema
   * @param {string} key The field name
   */
  getInputType(key: string) {
    if (this.schema.paths[key].instance === 'Date') {
      return 'datetime-local';
    } else if (this.schema.paths[key].instance === 'Number') {
      return 'number';
    } else if (this.schema.paths[key].instance === 'Boolean') {
      return 'checkbox';
    } else {
      return 'text';
    }
  }

  /**
   * Update the form value for a boolean instance
   * @param {boolean} formControlValue The form control value - should be a boolean
   * @param {string} formControlName The name of the form control
   * @param {string} inputType The input type
   * @param {number} index The index of the form group in the form array object
   */
  updateFormValue(formControlValue: boolean, formControlName: string, inputType: string, index: number) {
    if (inputType === 'checkbox') {
      formControlValue = !formControlValue;
      const formGroup = this.form.get('questions')['controls'][index];
      formGroup.get(formControlName).patchValue(formControlValue);
    }
  }

}
