import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-formcontrol-select-rel',
  template: `
    <div class="form-group">
      <label class="col-sm-2 control-label">{{displayName}}</label>
      <div class="col-sm-10">
        <ng-select  [multiple]="multiple"
                    [items]="items"
                    [disabled]="form.controls[field].disabled"
                    [active]="active"
                    (data)="refreshValue($event)"
                    (selected)="selected($event)"
                    (removed)="removed($event)"
                    (typed)="typed($event)"
                    placeholder="Nothing selected"></ng-select>
      </div>
    </div>
  `,
  styles: [`

  `],
})
export class FormcontrolSelectRelComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() object: {};
  @Input() searchClass: string;
  @Input() searchField: string = 'displayName';
  @Input() field: string;
  @Input() displayName: string;
  @Input() multiple: boolean = false;
  items: { id: string, text: string}[] = [];
  active: any[];

  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.active = this.generateArray();

    // TODO: This is messy, rebuild generateArray
    if (this.multiple) {
      this.refreshValue(this.active);
    } else {
      this.refreshValue(this.active[0]);
    }

    // Preload some options
    this.typed('');
  }

  refreshValue(data: any) {
    if (data) {
      if (data.constructor === Array) {
        const ids = data.map((o) => o.id);
        this.form.get(this.field).patchValue(ids);
      } else {
        this.form.get(this.field).patchValue(data.id);
      }
    }
  }

  selected(data: object) {
    console.log('selected', data);
  }

  removed(data: object) {
    console.log('removed', data);
  }

  typed(data: string) {
    this.adminService.search(this.searchClass, data, this.searchField)
      .then((response) => {
        this.items = response.items.map(((o) => {
          return { id: o._id, text: o[this.searchField] };
        }));
      });
  }

  generateArray() {
    let arrayData = [];
    if (this.object[this.field]) {
      if (this.object[this.field].constructor === Array) {
        arrayData = this.object[this.field].map((o) => { return { id: o._id, text: o[this.searchField] }; });
      } else {
        arrayData = [{ id: this.object[this.field]._id, text: this.object[this.field][this.searchField] }];
      }
    }
    return arrayData;
  }

}
