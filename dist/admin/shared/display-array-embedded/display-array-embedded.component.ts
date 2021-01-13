import { Component, Input } from '@angular/core';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-display-array-embedded',
  template: `
    <div class="col-sm-10">
      <div *ngFor="let dataObject of value; let i = index" class="row custom-object">
        <div class="row">
          <div *ngFor="let customObject of [adminService.schema[key].schema.paths]">
            <div class="col-sm-12">
              <app-schema-show
              [schema]="customObject"
              [object]="value[i]">
              </app-schema-show>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-object{border:1px solid #ededed;border-radius:10px;padding:5px;margin-bottom:10px;background:rgba(240,240,240,0.5)}
  `],
})
export class DisplayArrayEmbeddedComponent {
  @Input() value: any;
  @Input() key: string;

  constructor(
    public adminService: AdminService,
  ) { }
}
