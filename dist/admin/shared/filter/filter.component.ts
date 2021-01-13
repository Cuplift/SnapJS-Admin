import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { FilterService } from './filter.service';
import * as moment from 'moment';

@Component({
  selector: 'app-filter',
  template: `
    <form #form="ngForm">
      <div *ngFor="let filter of filters; let i = index">
        <div class="row">

          <div class="col-md-4 form-group">
            <label for="fieldSelect">Field: </label><br>
            <select
              class="form-control"
              name="fieldSelect_{{i}}"
              [(ngModel)]="filter.field"
              required>
              <option value="">---Please select---</option>
              <ng-template ngFor let-key [ngForOf]="adminService.schemaKeys">
                <option
                  *ngIf="(schema[key].instanceOverride !== 'Hidden' ||
                          schema[key].instanceOverride !== 'Remove') &&
                          !schema[key].displayKey"
                  [value]="key">
                  {{schema[key].displayName || key}}
                </option>
            
                <!-- If this is a relationship, use the displayKey -->
                <option
                  *ngIf="(schema[key].instanceOverride !== 'Hidden' ||
                          schema[key].instanceOverride !== 'Remove') &&
                          schema[key].displayKey"
                  [value]="key + '.' + schema[key].displayKey">
                  {{schema[key].displayName || key}}
                </option>
              </ng-template>
            </select>
          </div>

          <div class="col-md-4 form-group" *ngIf="filter.field">
            <label for="operatorSelect">Operator: </label><br>
            <!-- Select for relationship field -->
            <select
              class="form-control"
              name="operatorSelect_{{i}}"
              [(ngModel)]="filter.operator"
              required
              *ngIf="filterService.isRelationship(filter.field)">
              <option value="">---Please select---</option>
              <option
                *ngFor="let operator of filterService.operators[schema[filter.field.split('.')[0]].instance] || filterService.operators.String"
                [value]="operator">
                {{operator}}
              </option>
            </select>

            <!-- Select for non relationship field -->
            <select
              class="form-control"
              name="operatorSelect_{{i}}"
              [(ngModel)]="filter.operator"
              required
              *ngIf="!filterService.isRelationship(filter.field)">
              <option value="">---Please select---</option>
              <option
                *ngFor="let operator of filterService.operators[schema[filter.field].instance] || filterService.operators.String"
                [value]="operator">
                {{operator}}
              </option>
            </select>
          </div>

          <!-- Value field for a relationship -->
          <div *ngIf="filter.operator && filterService.isRelationship(filter.field)">
            <div
              class="col-md-4 form-group"
              *ngIf="filter.field &&
                      schema[filter.field.split('.')[0]].instance != 'Boolean' && schema[filter.field.split('.')[0]].instance != 'Date'">
              <label for="valueSelect">Value: </label><br>
              <input
                class="form-control"
                name="filterValue_{{i}}"
                [(ngModel)]="filter.value"
                type="search"
                required="string" />
            </div>
            <div
              class="col-md-2 form-group"
              *ngIf="filter.field && schema[filter.field.split('.')[0]].instance === 'Date'">
              <label for="valueSelect">Date: </label><br>
              <input
                class="form-control"
                name="filterValue_{{i}}"
                [(ngModel)]="filter.date"
                type="date"
                (change)="combineDateTime(filter)"
                required />
            </div>
            <div
              class="col-md-2 form-group"
              *ngIf="filter.field && schema[filter.field.split('.')[0]].instance === 'Date'">
              <label for="valueSelect">Time: </label><br>
              <input
                class="form-control"
                name="filterValue_{{i}}"
                [(ngModel)]="filter.time"
                type="time"
                (change)="combineDateTime(filter)"
                required />
            </div>
          </div>

          <!-- Value field for non relationship field -->
          <div *ngIf="filter.operator && !filterService.isRelationship(filter.field)">
            <div
              class="col-md-4 form-group"
              *ngIf="filter.field &&
                      schema[filter.field].instance != 'Boolean' &&
                      schema[filter.field].instance != 'Date'">
              <label for="valueSelect">Value: </label><br>
              <input
                class="form-control"
                name="filterValue_{{i}}"
                [(ngModel)]="filter.value"
                type="search"
                required="string" />
            </div>
            <div
              class="col-md-2 form-group"
              *ngIf="filter.field && schema[filter.field].instance === 'Date'">
              <label for="valueSelect">Date: </label><br>
              <input
                class="form-control"
                name="filterValue_{{i}}"
                [(ngModel)]="filter.date"
                type="date"
                (change)="combineDateTime(filter)"
                required />
            </div>
            <div
              class="col-md-2 form-group"
              *ngIf="filter.field && schema[filter.field].instance === 'Date'">
              <label for="valueSelect">Time: </label><br>
              <input
                class="form-control"
                name="filterValue_{{i}}"
                [(ngModel)]="filter.time"
                type="time"
                (change)="combineDateTime(filter)"
                required />
            </div>
          </div>
        </div>
      </div>
      <div class="pull-right">
        <button type="button" class="btn btn-default" [disabled]="!form.valid" (click)="addFilters()"><i class="fa fa-plus"></i></button>
        <button type="submit" class="btn btn-default" [disabled]="!form.valid" (click)="findAllWithFilters()">Filter</button>
        <button type="submit" class="btn btn-default" *ngIf="filters.length > 1 || form.valid" (click)="clearFilters()">Clear</button>
      </div>
    </form>
  `,
  styles: [`

  `],
})

export class FilterComponent {
  @Input() filters: any[];
  @Input() schema: any;
  @Input() findAll: Function;
  @Input() itemsPerPage: number;
  @Input() skip: number;
  @Input() sort: string;
  form: FormGroup = new FormGroup({});
  query: any;

  constructor(
    public adminService: AdminService,
    public filterService: FilterService,
  ) {}

  addFilters() {
    this.filters.push({ field: '', operator: '', value: '' });
  }

  /**
   * Calls findAll passing the query filters
   * Must be called as a seperate function in order for it to hit the parent controller
   */
  findAllWithFilters() {
    this.query = this.filterService.buildQuery(this.filters, this.itemsPerPage, this.skip, this.sort);
    this.findAll(this.query);
  }

  /**
   * Calls findAll function from parent controller to reset filters
   * Must be called as a seperate function in order for it to hit the parent controller
   */
  resetFilters() {
    this.findAll();
  }

  /**
   * Removes filters from search and displays all companies
   * Setting this.filters.length to 0 so it empties the parent filters as well
   * Adding the first empty filter back in
   */
  clearFilters() {
    this.filters.length = 0;
    this.addFilters();
    this.resetFilters();
    window.history.pushState({}, document.title, window.location.href.split('?')[0]);
  }

  /**
   * Combines date and time values of filer
   */
  combineDateTime(filter) {
    let date = moment(filter.date).format('YYYY-MM-DD');
    let time = moment(filter.time).format('kk:mm:ss Z');

    // Subtracting 1 hour from time if it's DST because the database time won't account for this
    if (moment(filter.date).isDST()) {
      time = moment(filter.time).subtract(60, 'minutes').format('kk:mm:ss Z');
    }

    let dateTime = moment(date + ' ' + time, 'YYYY-MM-DD HH:mm:ss Z').toISOString();
    filter.value = dateTime;
  }
}
