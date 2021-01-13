import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService } from '../admin.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-admin-detail',
  template: `
    <div class="container-fluid" *ngIf="object">

      <div class="row">
        <div class="col-lg-12">
          <div class="panel">
            <div class="panel-body table-responsive">
              <ul class="list-group">
                <ng-template ngFor let-key [ngForOf]="adminService.schemaKeys">
                  <li class="list-group-item"
                    *ngIf="adminService.schema[key] && adminService.schema[key].instanceOverride !== 'Hidden' && adminService.schema[key].instanceOverride !== 'Remove'"
                      [ngSwitch]="adminService.schema[key].instanceOverride || adminService.schema[key].instance">

                    <!-- Image -->
                    <div *ngSwitchCase="'Image'">
                      <span>
                        <div class="row">
                          <div class="col-sm-1">
                            <strong class="text-wordwrap">{{adminService.schema[key].displayName || key}}:</strong>
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
                            <strong class="text-wordwrap">{{adminService.schema[key].displayName || key}}:</strong>
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
                            <strong class="text-wordwrap">{{adminService.schema[key].displayName || key}}:</strong>
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
                            <strong class="text-wordwrap">{{adminService.schema[key].displayName || key}}:</strong>
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
                        *ngIf="adminService.schema[key].caster && adminService.schema[key].caster.options && !adminService.schema[key].caster.options.ref">
                        <strong>{{key}}: </strong>
                        <app-display-array
                          [field]="adminService.schema[key].displayName || key"
                          [value]="object[key]"> 
                        </app-display-array>
                      </span>
                    </div>

                    <!-- Single string -->
                    <div *ngSwitchCase="'SingleSelect'">
                      <app-display-text
                        *ngIf="adminService.schema[key].instanceOverride !== 'Hidden'"
                        [field]="adminService.schema[key].displayName || key"
                        [value]="object[key]">
                      </app-display-text>
                    </div>

                    <!-- Multi select of strings -->
                    <div *ngSwitchCase="'MultiSelect'">
                      <span>
                        <strong>{{adminService.schema[key].displayName || key}}: </strong>
                        <app-display-array
                          [field]="key"
                          [value]="object[key]">
                        </app-display-array>
                     </span>
                    </div>

                    <!-- Single relationship -->
                    <div *ngSwitchCase="'ObjectID'">
                      <app-display-single-rel 
                        *ngIf="adminService.schema[key].options &&
                                adminService.schema[key].options.ref &&
                                key !== '_id'"
                        [value]="object[key]"
                        [field]="adminService.schema[key].displayName || key"
                        [className]="adminService.schema[key].options.ref"
                        [displayKey]="adminService.schema[key].displayKey || adminService.schema[key].searchField"> 
                      </app-display-single-rel>
                    </div>

                    <!-- Select array of relationships -->
                    <div *ngSwitchCase="'Array'">
                      <app-display-array-rel 
                        *ngIf="adminService.schema[key].caster && adminService.schema[key].caster.options && adminService.schema[key].caster.options.ref"
                        [className]="adminService.schema[key].caster.options.ref"
                        [displayKey]="adminService.schema[key].displayKey || adminService.schema[key].searchField"
                        [field]="adminService.schema[key].displayName || key"
                        [value]="object[key]">
                      </app-display-array-rel>
                    </div>

                    <!-- Object Id -->
                    <div *ngSwitchCase="'ObjectID'">
                      <app-display-text
                        *ngIf="key === '_id'"
                        [field]="adminService.schema[key].displayName || key"
                        [value]="object[key]">
                      </app-display-text>
                    </div>

                    <!-- Wysiwyg editor -->
                    <div *ngSwitchCase="'Wysiwyg'">
                      <span>
                        <strong>{{adminService.schema[key].displayName || key}}:</strong>
                        <div [innerHTML]="object[key]"></div>
                      </span>
                    </div>

                    <!-- Single embedded document -->
                    <div *ngSwitchCase="'Embedded'">
                      <div class="row">
                        <div class="col-sm-2">
                          <label>{{adminService.schema[key].displayName || key}}: </label>
                        </div>
                        <app-display-array-embedded
                          *ngIf="object[key]"
                          [value]="[object[key]]"
                          [key]="key">
                        </app-display-array-embedded>
                      </div>
                    </div>

                    <!-- Single custom object -->
                    <div *ngSwitchCase="'CustomObject'">
                      <div class="row">
                        <div class="col-sm-2">
                          <label>{{adminService.schema[key].displayName || key}}: </label>
                        </div>
                        <app-display-array-embedded
                          *ngIf="object[key]"
                          [value]="[object[key]]"
                          [key]="key">
                        </app-display-array-embedded>
                      </div>
                    </div>

                    <!-- Array of embedded schemas or custom objects -->
                    <div *ngSwitchCase="'Array'">
                      <div class="row" *ngIf="!adminService.schema[key].caster && adminService.schema[key].schema.tree.id">
                        <div class="col-sm-2">
                          <label>{{adminService.schema[key].displayName || key}}: </label>
                        </div>
                        <app-display-array-embedded [value]="object[key]" [key]="key">
                        </app-display-array-embedded>
                      </div>
                    </div>

                    <!-- SubDocument -->
                    <div *ngSwitchCase="'SubDocument'">
                      <app-display-text
                        [field]="adminService.schema[key].displayName || key"
                        [value]="object[key] && adminService.schema[key].displayKey ? object[key][adminService.schema[key].displayKey] : object[key]">
                      </app-display-text>
                    </div>

                    <!-- Date type -->
                    <div *ngSwitchCase="'Date'">
                      <app-display-text
                        *ngIf="adminService.schema[key].instanceOverride !== 'Hidden'"
                        [field]="adminService.schema[key].displayName || key"
                        [value]="object[key]"
                        [isDate]="true">
                      </app-display-text>
                    </div>

                    <!-- Default type -->
                    <div *ngSwitchDefault>
                      <app-display-text
                        *ngIf="adminService.schema[key].instanceOverride !== 'Hidden'"
                        [field]="adminService.schema[key].displayName || key"
                        [value]="object[key]">
                      </app-display-text>
                    </div>
                  </li>
                </ng-template>
              </ul>

              <a [routerLink]="['/admin', adminService.className, object._id, 'edit']">Edit</a>
              <button (click)="deleteItem(object)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`

  `],
})
export class AdminDetailComponent implements OnInit {
  object: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => {
        this.adminService.className = params.className;
        this.adminService.loadSchema();

        return this.adminService.getById(params.id);
      })
      .subscribe((object) => this.object = object);
  }

  deleteItem(object: any) {
    this.adminService.delete(object)
      .then((response) => {
        this.router.navigate([`/admin/${this.adminService.className}`]);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
