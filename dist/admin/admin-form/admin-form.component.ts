import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-form',
  template: `
    <form novalidate [formGroup]="form" (ngSubmit)="submit()" class="form-horizontal">
      <div *ngFor="let schemaKey of schemaKeys">
        <div [ngSwitch]="schema[schemaKey].instanceOverride || schema[schemaKey].instance">

          <app-formcontrol-input
            *ngSwitchCase="'Boolean'"
            [form]="form"
            [field]="schemaKey"
            [displayName]="schema[schemaKey].displayName || schemaKey"
            [inputType]="'checkbox'">
          </app-formcontrol-input>

          <app-formcontrol-input
            *ngSwitchCase="'Number'"
            [form]="form"
            [field]="schemaKey"
            [displayName]="schema[schemaKey].displayName || schemaKey"
            [inputType]="'number'">
          </app-formcontrol-input>

          <app-formcontrol-input
            *ngSwitchCase="'Date'"
            [form]="form"
            [field]="schemaKey"
            [displayName]="schema[schemaKey].displayName || schemaKey"
            [inputType]="'datetime-local'">
          </app-formcontrol-input>

          <app-formcontrol-input
            *ngSwitchCase="'Hidden'"
            [form]="form"
            [field]="schemaKey"
            [displayName]="schema[schemaKey].displayName || schemaKey"
            [inputType]="'hidden'">
          </app-formcontrol-input>

          <app-formcontrol-input
            *ngSwitchCase="'Disabled'"
            [form]="form"
            [field]="schemaKey"
            [displayName]="schema[schemaKey].displayName || schemaKey"
            [inputType]="'text'">
          </app-formcontrol-input>

          <app-formcontrol-select
            *ngSwitchCase="'SingleSelect'"
            [form]="form"
            [object]="object"
            [field]="schemaKey"
            [displayName]="schema[schemaKey].displayName || schemaKey"
            [multiple]="false"
            [items]="schema[schemaKey].options"
            [displayName]="schema[schemaKey].displayName || schemaKey">
          </app-formcontrol-select>

          <app-formcontrol-select
            *ngSwitchCase="'MultiSelect'"
            [form]="form"
            [object]="object"
            [field]="schemaKey"
            [displayName]="schema[schemaKey].displayName || schemaKey"
            [multiple]="true"
            [items]="schema[schemaKey].options"
            [displayName]="schema[schemaKey].displayName || schemaKey">
          </app-formcontrol-select>

          <!-- Array of subdocuments -->
          <div *ngSwitchCase="'Array'">
            <app-formcontrol-array-rel
              *ngIf="schema[schemaKey].schema"
              [disabled]="schema[schemaKey].instanceOptions && schema[schemaKey].instanceOptions.disabled" 
              [form]="form"
              [object]="object" 
              [field]="schemaKey"
              [displayName]="schema[schemaKey].displayName || schemaKey"
              [schema]="schema[schemaKey].schema">
            </app-formcontrol-array-rel>
          </div>

          <!-- Single select for relationship (searches for matches) -->
          <div *ngSwitchCase="'ObjectID'">
            <app-formcontrol-select-rel 
              *ngIf="schema[schemaKey].options && schema[schemaKey].options.ref" 
              [form]="form" 
              [object]="object" 
              [searchClass]="schema[schemaKey].options.ref" 
              [searchField]="schema[schemaKey].searchField" 
              [field]="schemaKey"
              [displayName]="schema[schemaKey].displayName || schemaKey" 
              [multiple]="false">  
            </app-formcontrol-select-rel>
          </div>

          <!-- Select array of relationships (searches for matches) -->
          <div *ngSwitchCase="'Array'">
            <app-formcontrol-select-rel 
              *ngIf="schema[schemaKey].caster.options && schema[schemaKey].caster.options.ref"
              [form]="form" 
              [object]="object" 
              [searchClass]="schema[schemaKey].caster.options.ref"
              [searchField]="schema[schemaKey].searchField"
              [field]="schemaKey"
              [displayName]="schema[schemaKey].displayName || schemaKey"
              [multiple]="true">
            </app-formcontrol-select-rel>
          </div>

          <!-- Select array of strings -->
          <div *ngSwitchCase="'Array'">
            <app-formcontrol-array
              *ngIf="schema[schemaKey].caster.options && !schema[schemaKey].caster.options.ref"
              [form]="form" 
              [field]="schemaKey"
              [displayName]="schema[schemaKey].displayName || schemaKey">
            </app-formcontrol-array>
          </div>

          <!-- Single embedded document -->
          <div *ngSwitchCase="'Embedded'">
            <app-formcontrol-group
              [disabled]="schema[schemaKey].instanceOptions && schema[schemaKey].instanceOptions.disabled"
              [form]="form"
              [field]="schemaKey"
              [displayName]="schema[schemaKey].displayName || schemaKey"
              [schema]="schema[schemaKey].schema">
            </app-formcontrol-group>
          </div>

          <!-- Wysiwyg editor -->
          <div *ngSwitchCase="'Wysiwyg'">
            <app-formcontrol-tinymce 
              [form]="form" 
              [field]="schemaKey"
              [displayName]="schema[schemaKey].displayName || schemaKey">
            </app-formcontrol-tinymce>
          </div>

          <!-- Images -->
          <div *ngSwitchCase="'Image'">
            <app-formcontrol-file-upload
              [isMultiple]="false"
              [field]="schemaKey"
              [displayName]="schema[schemaKey].displayName || schemaKey"
              [object]="object"
              [allowedMimeType]="schema[schemaKey].allowedMimeType"
              [maxFileSize]="schema[schemaKey].maxFileSize"
              [form]="form">
            </app-formcontrol-file-upload>
          </div>

          <!-- File -->
          <div *ngSwitchCase="'File'">
            <app-formcontrol-file-upload
              [isMultiple]="false"
              [field]="schemaKey"
              [displayName]="schema[schemaKey].displayName || schemaKey"
              [object]="object"
              [allowedMimeType]="schema[schemaKey].allowedMimeType"
              [maxFileSize]="schema[schemaKey].maxFileSize"
              [form]="form">
            </app-formcontrol-file-upload>
          </div>

          <!-- Multiple images -->
          <div *ngSwitchCase="'ImageArray'">
            <app-formcontrol-file-upload
              [isMultiple]="true"
              [field]="schemaKey"
              [displayName]="schema[schemaKey].displayName || schemaKey"
              [object]="object"
              [allowedMimeType]="schema[schemaKey].allowedMimeType"
              [maxFileSize]="schema[schemaKey].maxFileSize"
              [form]="form">
            </app-formcontrol-file-upload>
          </div>

          <!-- Multiple files -->
          <div *ngSwitchCase="'FileArray'">
            <app-formcontrol-file-upload
              [isMultiple]="true"
              [field]="schemaKey"
              [displayName]="schema[schemaKey].displayName || schemaKey"
              [object]="object"
              [allowedMimeType]="schema[schemaKey].allowedMimeType"
              [maxFileSize]="schema[schemaKey].maxFileSize"
              [form]="form">
            </app-formcontrol-file-upload>
          </div>

          <!-- SubDocument -->
          <div *ngSwitchCase="'SubDocument'">
            <app-formcontrol-subdocument
              *ngIf="object[schemaKey]"
              [displayName]="schema[schemaKey].displayName"
              [value]="schema[schemaKey].displayKey ? object[schemaKey][schema[schemaKey].displayKey] : object[schemaKey]">
            </app-formcontrol-subdocument>
          </div>

          <!-- Default input type -->
          <div *ngSwitchDefault>
            <app-formcontrol-input [form]="form" [field]="schemaKey" [inputType]="'text'" [displayName]="schema[schemaKey].displayName || schemaKey"></app-formcontrol-input>
          </div>
        </div>

        <!-- Display validation errors -->
        <control-errors [control]="form.controls[schemaKey]"></control-errors>
      </div>

      <!-- <button type="submit" [disabled]="!form.valid">Save</button> -->
      <button type="submit">Save</button>
    </form>
  `,
  styles: [`

  `],
})
export class AdminFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  formSubmitted: boolean = false;
  schemaKeys: any[] = [];
  @Input() object: any = {};
  @Input() schema: any = {};
  @Input() submitFunction: Function;

  constructor(
    private formBuilder: FormBuilder,
    public adminService: AdminService,
  ) {}

  ngOnInit() {
    if (this.schema) {
      this.schemaKeys = Object.keys(this.schema);
    }

    // Remove hidden keys
    let i = this.schemaKeys.length;
    while (i--) {
      if (this.schema[this.schemaKeys[i]].instanceOverride === 'Remove') {
        delete this.schema[this.schemaKeys[i]];
        this.schemaKeys.splice(i, 1);
      }
    }

    // Build Form
    this.schemaKeys.forEach((key) => {
      if ((this.schema[key].instanceOverride === 'Array' || this.schema[key].instance === 'Array') && this.schema[key].schema) {
        this.form.registerControl(key, this.formBuilder.array([]));

      } else if ((this.schema[key].instanceOverride === 'ImageArray' || this.schema[key].instance === 'ImageArray')
                  || (this.schema[key].instanceOverride === 'FileArray' || this.schema[key].instance === 'FileArray')) {
        this.form.registerControl(key, this.formBuilder.array([]));

      } else if (this.schema[key].instanceOverride === 'Embedded' || this.schema[key].instance === 'Embedded') {
        this.form.registerControl(key, new FormGroup({}));
        const formGroup = <FormGroup>this.form.get(key);
        const schemaPaths = Object.keys(this.schema[key].schema.paths);
        schemaPaths.forEach((schemaPath) => {
          const value = this.object[key] && this.object[key][schemaPath] ? this.object[key][schemaPath] : '';
          formGroup.registerControl(schemaPath, new FormControl(value));
        });
      } else {
        let value = '';

        // If the key has a period, this is a relationship
        if (key.indexOf('.') >= 0) {
          const array = key.split('.');
          if (this.object[array[0]] && this.object[array[0]][array[1]]) {
            value = this.object[array[0]][array[1]];
          }

        } else if (this.object[key] && this.schema[key].instance === 'Date') {
          // If this is a date we need to format it as a string
          value = moment(this.object[key]).format('YYYY-MM-DDTHH:mm');
        } else if (this.object[key] && this.schema[key].instance !== 'Date') {
          value = this.object[key];
        }

        // Set the field to disabled if overwritten in config
        let disabled;
        if (this.schema[key].instanceOverride === 'Disabled') {
          disabled = true;
        } else if (this.schema[key].instanceOptions && this.schema[key].instanceOptions.disabled) {
          disabled = true;
        } else {
          disabled = false;
        }

        // this.form.registerControl(key, new FormControl({value, disabled}, [Validators.required]));
        this.form.registerControl(key, new FormControl({value, disabled}, []));
      }
    });
  }

  submit() {
    if (this.form.valid && this.submitFunction) {
      this.submitFunction(this.form);
    }
  }
}
