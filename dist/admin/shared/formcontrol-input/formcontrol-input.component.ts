import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AdminService } from "../../admin.service";

@Component({
  selector: "app-formcontrol-input",
  template: `
    <div [formGroup]="form" class="form-group">
      <label
        *ngIf="inputType !== 'hidden'"
        for="{{ field }}"
        class="col-sm-2 control-label"
        >{{ displayName }}</label
      >
      <div class="col-sm-10">
        <input
          [formControlName]="field"
          type="{{ inputType }}"
          class="form-control"
          [checked]="form.controls[field].value"
          (change)="updateFormValue(form.controls[field].value)"
        />
        <p class="text-muted" *ngIf="inputType === 'datetime-local'">
          timezone offset: {{ adminService.tzOffsetInHours }}
        </p>
      </div>
    </div>
  `,
  styles: [`

  `],
})
export class FormcontrolInputComponent {
  @Input() form: FormGroup;
  @Input() field: string;
  @Input() displayName: string;
  @Input() inputType = "input";
  constructor(public adminService: AdminService) {}

  ngOnInit() {
    console.log(this.form.controls[this.field].value);
  }

  /**
   * Update the form value for a boolean instance
   * @param {any} formControlValue the form control value - should be a boolean or blank string
   */
  updateFormValue(formControlValue: any) {
    if (this.inputType === "checkbox") {
      formControlValue = !formControlValue;

      this.form.patchValue({
        [this.field]: formControlValue,
      });
    }
  }
}
