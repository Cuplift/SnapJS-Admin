import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-formcontrol-select',
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
                    placeholder="Nothing selected"></ng-select>
      </div>
    </div>
  `,
  styles: [`

  `],
})
export class FormcontrolSelectComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() object: {};
  @Input() field: string;
  @Input() displayName: string;
  @Input() multiple: boolean = false;
  @Input() items: { id: string, text: string}[] = [];
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

  selected(data: any) {
    console.log('selected', data);
  }

  removed(data: any) {
    console.log('removed', data);
  }

  generateArray() {
    let arrayData = [];
    if (this.object[this.field]) {
      if (this.object[this.field].constructor === Array) {
        arrayData = this.object[this.field].map((o) => { return { id: o, text: o }; });
      } else {
        arrayData = [{ id: this.object[this.field], text: this.object[this.field] }];
      }
    }
    return arrayData;
  }

}
