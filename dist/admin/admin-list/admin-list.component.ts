import { Component, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ConstantsService } from '../constants.service';

@Component({
  selector: 'app-admin-list',
  template: `
    <div class="container-fluid">
      <div class="page-header">
        <h1>{{adminService.className}}</h1>
        <div class="actions">
          <a [routerLink]="['/admin', adminService.className, 'new']" class="btn btn-primary"><i class="fa fa-plus"></i> Create</a>
          <a (click)="exportToCsv()" class="btn btn-default"><i class="fa fa-file-o" aria-hidden="true"></i> Export to CSV</a>
          <a (click)="toggleImport()" class="btn btn-default">
            <i class="fa fa-file-o" aria-hidden="true"></i>
            <span *ngIf="importToggle"> Hide import</span>
            <span *ngIf="!importToggle"> Import from CSV</span>
          </a>    
          <a (click)="filterToggle = !filterToggle" class="btn btn-default">
            <i class="fa fa-filter"></i>
            <span *ngIf="filterToggle"> Hide Filter</span>
            <span *ngIf="!filterToggle"> Show Filter</span>
          </a>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="panel">
            <div class="panel-body table-responsive">
              <div *ngIf="importToggle" class="col-md-12">
                <app-file-drop
                  [file]="uploadedFile"
                  (change)="updateFile($event)">
                </app-file-drop>
           
                <div class="pull-right">
                  <button (click)="importFromCsv()" class="margin-top btn btn-primary" [disabled]="importLoading">
                    <i class="fa fa-file-o" aria-hidden="true"></i>
                    Import
                  </button>
                  <button (click)="cancelImport()" class="margin-top btn btn-default" [disabled]="importLoading">
                    <i class="fa fa-file-o" aria-hidden="true"></i>
                    Cancel
                  </button>
                  <div *ngIf="importLoading">
                    <i class="fa fa-spinner fa-spin"></i> 
                    Loading...
                  </div>
                </div>
              </div>
              <app-filter
                *ngIf="adminService.schema && filterToggle"
                [filters]="filters"
                [schema]="adminService.schema"
                [findAll]="filterFunction"
                [itemsPerPage]="itemsPerPage"
                [skip]="params.skip"
                [sort]="params.sort">
              </app-filter>
              <button *ngIf="selectedItems.length" class="btn btn-danger" (click)="deleteMultiple(selectedItems)">Delete ({{selectedItems.length}}) Items</button>
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th class="wordwrap-none">
                      <input [(ngModel)]="selectAll" (click)="toggleAllSelection()" type="checkbox">
                    </th>
                    <ng-template ngFor let-key [ngForOf]="adminService.schemaKeys">
                      <th class="wordwrap-none text-muted"
                        *ngIf="adminService.schema[key] &&
                        adminService.schema[key].instanceOverride !== 'Hidden' && adminService.schema[key].instanceOverride !== 'Wysiwyg' &&
                        adminService.schema[key].instanceOverride !== 'Remove'">
                        <a *ngIf="adminService.schema[key]" (click)="updateSort(key)">
                          {{adminService.schema[key].displayName || key}}
                          <i [ngClass]="toggle[key] ? 'fa fa-caret-up' : 'fa fa-caret-down'"></i>
                        </a>
                      </th>
                    </ng-template>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let object of objects">
                    <td><input type="checkbox" [(ngModel)]="object.Selected" (click)="toggleSelection(object._id)"></td>

                    <ng-template ngFor let-schemaKey [ngForOf]="adminService.schemaKeys">
                      <td
                        *ngIf="adminService.schema[schemaKey].instanceOverride !== 'Hidden' && adminService.schema[schemaKey].instanceOverride !== 'Wysiwyg' && 
                        adminService.schema[schemaKey].instanceOverride !== 'Remove'"
                        [ngSwitch]="adminService.schema[schemaKey].instanceOverride || adminService.schema[schemaKey].instance">

                        <!-- Image -->
                        <div *ngSwitchCase="'Image'">
                          <span>
                            <div class="row">
                              <app-display-file
                                *ngIf="object[schemaKey] && object[schemaKey].url"
                                [files]="[object[schemaKey]]">
                              </app-display-file>
                            </div>
                          </span>
                        </div>

                        <!-- Multiple Images -->
                        <div *ngSwitchCase="'ImageArray'">
                          <span>
                            <div class="row">
                              <app-display-file
                                [files]="object[schemaKey]">
                              </app-display-file>
                            </div>
                          </span>
                        </div>

                        <!-- File -->
                        <div *ngSwitchCase="'File'">
                          <span>
                            <div class="row">
                              <app-display-file
                                *ngIf="object[schemaKey]"
                                [files]="[object[schemaKey]]">
                              </app-display-file>
                            </div>
                          </span>
                        </div>

                        <!-- Multiple Files -->
                        <div *ngSwitchCase="'FileArray'">
                          <span>
                            <div class="row">
                              <app-display-file
                                [files]="object[schemaKey]">
                              </app-display-file>
                            </div>
                          </span>
                        </div>

                        <!-- Select array of strings -->
                        <div *ngSwitchCase="'Array'">
                          <app-display-array
                            *ngIf="adminService.schema[schemaKey].caster && adminService.schema[schemaKey].caster.options && !adminService.schema[schemaKey].caster.options.ref && object[schemaKey]"
                            [value]="object[schemaKey]"> 
                          </app-display-array>
                        </div>

                        <!-- Multi select of strings -->
                        <div *ngSwitchCase="'MultiSelect'">
                          <app-display-array
                            [value]="object[schemaKey]"> 
                          </app-display-array>
                        </div>

                        <!-- Single relationship -->
                        <div *ngSwitchCase="'ObjectID'">
                          <app-display-single-rel 
                            *ngIf="adminService.schema[schemaKey].options &&
                                    adminService.schema[schemaKey].options.ref &&
                                    schemaKey !== '_id'"
                            [value]="object[schemaKey]"
                            [className]="adminService.schema[schemaKey].options.ref"
                            [displayKey]="adminService.schema[schemaKey].displayKey || adminService.schema[schemaKey].searchField">
                          </app-display-single-rel>
                        </div>

                        <!-- Select array of relationships -->
                        <div *ngSwitchCase="'Array'">
                          <app-display-array-rel 
                            *ngIf="adminService.schema[schemaKey].caster && adminService.schema[schemaKey].caster.options && adminService.schema[schemaKey].caster.options.ref"
                            [className]="adminService.schema[schemaKey].caster.options.ref"
                            [displayKey]="adminService.schema[schemaKey].displayKey || adminService.schema[schemaKey].searchField"
                            [value]="object[schemaKey]">
                          </app-display-array-rel>
                        </div>

                        <!-- Object Id -->
                        <div *ngSwitchCase="'ObjectID'">
                          <p *ngIf="schemaKey === '_id'">{{object[schemaKey]}}</p>
                        </div>

                        <!-- Array of embedded schemas or custom objects -->
                        <div *ngSwitchCase="'Array'">
                          <div class="truncate" *ngIf="!adminService.schema[schemaKey].caster && adminService.schema[schemaKey].schema.tree.id">
                            <i class="text-muted">Embedded</i>
                          </div>
                        </div>

                        <!-- Single embedded document -->
                        <div *ngSwitchCase="'Embedded'">
                          <div class="truncate"><i class="text-muted">Embedded</i></div>
                        </div>

                        <!-- SubDocument -->
                        <div *ngSwitchCase="'SubDocument'">
                          <app-display-text
                            [value]="object[schemaKey] && adminService.schema[schemaKey].displayKey ? object[schemaKey][adminService.schema[schemaKey].displayKey] : object[schemaKey]">
                          </app-display-text>
                        </div>

                        <!-- Single custom object -->
                        <div *ngSwitchCase="'CustomObject'">
                          <div class="truncate"><i class="text-muted">Embedded</i></div>
                        </div>

                        <!-- Date type -->
                        <div *ngSwitchCase="'Date'">
                          <app-display-text
                            [value]="object[schemaKey]"
                            [isDate]="true">
                          </app-display-text>
                        </div>

                        <!-- Default type -->
                        <!-- Leave the value blank if it's a password -->
                        <div *ngSwitchDefault>
                          <app-display-text *ngIf="schemaKey !== 'password'"
                            [value]="object[schemaKey]">
                          </app-display-text>
                          <app-display-text *ngIf="schemaKey === 'password'"
                            [value]="">
                          </app-display-text>
                        </div>
                    
                      </td>
                    </ng-template>

                    <td>
                      <a [routerLink]="['/admin', adminService.className, object._id]" class="btn btn-default btn-sm">View</a>
                    </td>
                    <td>
                      <button (click)="deleteItem(object)" class="btn btn-default btn-sm">Delete</button>
                    </td>
                    <td>
                      <a [routerLink]="['/admin', adminService.className, object._id, 'edit']" class="btn btn-default btn-sm">Edit</a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <ngb-pagination [collectionSize]="totalObjects" [pageSize]="itemsPerPage" [(page)]="currentPage" [boundaryLinks]="true" [maxSize]="5" [ellipses]="true" (pageChange)="pageChanged()"></ngb-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`

  `],
})
export class AdminListComponent implements OnInit {
  objects: any;
  totalObjects: Number;
  params: any = { skip: 0, sort: '-createdAt' };
  itemsPerPage = 20;
  currentPage = 1;
  selectAll: boolean;
  selectedItems: any[] = [];
  filterToggle: boolean;
  toggle: any = {};
  form: FormGroup = new FormGroup({});
  uploadedFile: '';
  importLoading: boolean;
  importToggle: boolean;
  filters: any[] = [{ field: '', operator: '', value: '' }];
  filterFunction: Function;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public adminService: AdminService,
    private toastr: ToastsManager,
    private vRef: ViewContainerRef,
    private constants: ConstantsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      // Clear out filter
      this.resetFilters();

      this.adminService.className = params.className;
      this.adminService.loadSchema()
        .then((response) => {
          this.changeDetectorRef.markForCheck();
          this.findAll();
        });
    });

    // Bind 'this' since the submit function is a callback
    this.filterFunction = this.findAll.bind(this);
  }

  findAll(params?: any): void {
    this.selectAll = false;
    this.selectedItems = [];
    this.params = params || { limit: this.itemsPerPage, skip: this.params.skip, sort: this.params.sort };

    this.adminService.query(this.params)
      .then((response) => {
        this.totalObjects = response.itemCount;
        this.objects = response.items;
      });
  }

  /**
   * Handles pagination of items
   */
  pageChanged() {
    this.params.skip = this.itemsPerPage * (this.currentPage - 1);
    this.findAll(this.params);
    this.selectAll = false;
    this.selectedItems = [];
  }

  deleteItem(object: any) {
    if (window.confirm('Are you sure you want to delete')) {
      this.adminService.delete(object)
        .then(() => {
          this.findAll();
          this.toastr.success('Successfully deleted.', 'Success!');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  deleteMultiple(objectIds: string[]) {
    if (window.confirm('Are you sure?')) {
      this.adminService.deleteMultiple(objectIds)
        .then((response) => {
          this.selectedItems = [];
          this.findAll();
          this.toastr.success('Successfully deleted');
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.clearSelections();
    }
  }

  /**
   * Clear out all selected items
   */
  clearSelections() {
    this.selectAll = false;
    this.selectedItems = [];
    this.objects.forEach((object) => {
      object.Selected = false;
    });
  }

  /**
   * Toggle the selectAll property and mark each object as selected/deselected
   */
  toggleAllSelection() {
    this.selectAll = !this.selectAll;
    this.selectedItems = this.objects.map((object) => {
      object.Selected = this.selectAll;
      return object._id;
    });

    if (!this.selectAll) { this.selectedItems = []; }
  }

  /**
   * Toggle an individual items selected property
   * @param {string} objectId The selected item's id
   */
  toggleSelection(objectId: string) {
    let index = this.selectedItems.indexOf(objectId);
    index >= 0 ? this.selectedItems.splice(index, 1) : this.selectedItems.push(objectId);
    this.selectAll = this.selectedItems.length === this.objects.length;
  }

  /**
   * Updates and reruns findAll() to sort objects based on key and asc / desc
   * The toggle state is tracked so that the UI can be udpated
   * @param  {String} key The key to sort by
   */
  updateSort(key: string) {
    let isDesc = !!this.params.sort.lastIndexOf('-', 0);
    this.params.sort = isDesc ? `-${key}` : key;
    this.toggle[key] = !isDesc;
    this.findAll(this.params);
  }

  /**
   * Direct user to URL that exports data to a CSV file
   */
  exportToCsv() {
    const token = localStorage.getItem('token');
    let exportUrl = `${this.constants.API_BASE_URL}/admin/${this.adminService.className}?export=true&access_token=${token}&`;

    // Remove limit and skip from the params for a csv export
    const exportParams = this.params;
    delete exportParams.skip;
    delete exportParams.limit;

    // Serialize params
    exportUrl += this.adminService.serializeParams(this.params).toString();
    window.open(exportUrl);
  }

  /**
   * Listens to the event emitter and sets the uploadedFile
   * @param event
   */
  updateFile(event: any) {
    this.uploadedFile = event;
  }

  /**
   * Switches the importToggle and resets the uploaded file
   */
  toggleImport() {
    this.uploadedFile = '';
    if (this.importToggle) {
      this.importToggle = false;
    } else {
      this.importToggle = true;
    }
  }

  /**
   * Imports the csv file.
   */
  importFromCsv() {
    // Checks for existence of a file
    if (this.uploadedFile !== '') {
      this.importLoading = true;
      this.adminService.importFromCsv(this.uploadedFile)
        .then((response) => {
          this.findAll();
          this.importLoading = false;
          this.importToggle = false;
          this.uploadedFile = '';
          this.toastr.success('Successfully imported');
        }, (error) => {
          this.findAll();
          this.importLoading = false;
          this.importToggle = false;
          this.uploadedFile = '';

          const message = this.buildServerErrors(error) || 'Import Error';
          this.toastr.error(message, null, { enableHTML: true });
        });
    } else {
      this.toastr.error('You need to upload a file before importing');
    }
  }

  /**
   * Sets the import toggle to false and resets the uploaded file
   */
  cancelImport() {
    this.importToggle = false;
    this.uploadedFile = '';
  }

  /**
   * Clear filter and manage filterToggle
   */
  resetFilters() {
    this.filters = [{ field: '', operator: '', value: '' }];
    this.filterToggle = false;
  }

  /**
   * Build error string from server errors
   * @param {any} error The error object
   */
  buildServerErrors(error: any) {
    let errorMessage = '';
    const errors = error.json().errors;

    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const message = errors[key].message;
        errorMessage += `${message}</br>`;
      }
    }

    return errorMessage;
  }

}
