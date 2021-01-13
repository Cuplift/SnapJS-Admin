import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AdminService } from "../../admin.service";

@Component({
  selector: "app-formcontrol-input",
  templateUrl: "./formcontrol-input.component.html",
  styleUrls: ["./formcontrol-input.component.scss"],
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
