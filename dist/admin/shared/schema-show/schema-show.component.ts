import { Component, Input } from '@angular/core';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-schema-show',
  template: `
      <ul class="list-group">

        <ng-template ngFor let-key [ngForOf]="adminService.getKeys(object)">
          <li class="list-group-item" *ngIf="schema[key].instanceOverride !== 'Hidden'" [ngSwitch]="schema[key].instanceOverride || schema[key].instance">

          <!-- Image -->
          <div *ngSwitchCase="'Image'">
            <span>
              <div class="row">
                <div class="col-sm-1">
                  <strong class="text-wordwrap">{{key}}:</strong>
                </div>
                <app-display-file
                  *ngIf="object[key]"
                  [files]="[object[key]]">
                </app-display-file>
              </div>
            </span>
          </div>

          <!-- Multiple Images -->
          <div *ngSwitchCase="'ImageArray'">
            <span>
              <div class="row">
                <div class="col-sm-1">
                  <strong class="text-wordwrap">{{key}}:</strong>
                </div>
                <app-display-file
                  *ngIf="object[key]"
                  [files]="object[key]">
                </app-display-file>
              </div>
            </span>
          </div>

          <!-- File -->
          <div *ngSwitchCase="'File'">
            <span>
              <div class="row">
                <div class="col-sm-1">
                  <strong class="text-wordwrap">{{key}}:</strong>
                </div>
                <app-display-file
                  *ngIf="object[key]"
                  [files]="[object[key]]">
                </app-display-file>
              </div>
            </span>
          </div>

          <!-- Multiple Files -->
          <div *ngSwitchCase="'FileArray'">
            <span>
              <div class="row">
                <div class="col-sm-1">
                  <strong class="text-wordwrap">{{key}}:</strong>
                </div>
                <app-display-file
                  [files]="object[key]">
                </app-display-file>
              </div>
            </span>
          </div>

          <!-- Select array of strings -->
          <div *ngSwitchCase="'Array'">
            <span 
              *ngIf="schema[key].caster.options && !schema[key].caster.options.ref">
              <strong>{{key}}: </strong>
              <app-display-array
                [field]="key"
                [value]="object[key]"> 
              </app-display-array>
            </span>
          </div>

          <!-- Single string -->
          <div *ngSwitchCase="'SingleSelect'">
            <app-display-text
              *ngIf="schema[key].instanceOverride !== 'Hidden'"
              [field]="key"
              [value]="object[key]">
            </app-display-text>
          </div>

          <!-- Multi select of strings -->
          <div *ngSwitchCase="'MultiSelect'">
            <span>
              <strong>{{key}}: </strong>
              <app-display-array
                [field]="key"
                [value]="object[key]">
              </app-display-array>
           </span>
          </div>

          <!-- Single relationship -->
          <div *ngSwitchCase="'ObjectID'">
            <app-display-single-rel 
              *ngIf="schema[key].options &&
                      schema[key].options.ref &&
                      key !== '_id'"
              [value]="object[key]"
              [field]="key"
              [className]="schema[key].options.ref"
              [displayKey]="schema[key].displayKey || schema[key].searchField"> 
            </app-display-single-rel>
          </div>

          <!-- Select array of relationships -->
          <div *ngSwitchCase="'Array'">
            <app-display-array-rel 
              *ngIf="schema[key].caster.options && schema[key].caster.options.ref"
              [className]="schema[key].caster.options.ref"
              [displayKey]="schema[key].displayKey || schema[key].searchField"
              [field]="key"
              [value]="object[key]">
            </app-display-array-rel>
          </div>

          <!-- Object Id -->
          <div *ngSwitchCase="'ObjectID'">
            <app-display-text
              *ngIf="key === '_id'"
              [field]="key"
              [value]="object[key]">
            </app-display-text>
          </div>

          <!-- Wysiwyg editor -->
          <div *ngSwitchCase="'Wysiwyg'">
            <span>
              <strong>{{key}}:</strong>
              <div [innerHTML]="object[key]"></div>
            </span>
          </div>

          <!-- Single embedded document or custom object -->
          <div *ngSwitchCase="'Embedded'">
            <pre>{{object[key] | json}}</pre>
          </div>

          <!-- Array of embedded schemas or custom objects -->
          <div *ngSwitchCase="'Array'">
            <div class="row" *ngIf="schema[key].caster._id">
              <div class="col-sm-2">
                <label>{{key}}: </label>
              </div>
              <div class="col-sm-10">
                <div *ngFor="let dataObject of object[key]; let i = index" class="row custom-object">
                  <div class="row">
                    <div *ngFor="let customObject of [schema[key].schema.paths]">
                      <div class="col-sm-12">
                        <app-schema-show
                        [schema]="customObject"
                        [object]="object[key][i]">
                        </app-schema-show>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Default type -->
          <div *ngSwitchDefault>
            <app-display-text
              *ngIf="schema[key].instanceOverride !== 'Hidden'"
              [field]="key"
              [value]="object[key]">
            </app-display-text>
          </div>
        </li>
      </ng-template>
    </ul>
  `,
  styles: [`

  `],
})
export class SchemaShowComponent {
  @Input() object: any;
  @Input() schema: any;

  constructor(
    public adminService: AdminService,
  ) { }
}
