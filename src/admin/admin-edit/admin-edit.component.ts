import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { AdminService } from "../admin.service";
import { ValidationService } from "../shared/control-errors/validation.service";
import "rxjs/add/operator/switchMap";

import * as moment from "moment";

@Component({
  selector: "app-admin-edit",
  templateUrl: "./admin-edit.component.html",
  styleUrls: ["./admin-edit.component.scss"],
})
export class AdminEditComponent implements OnInit {
  object: any;
  submitFunction: Function;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastsManager,
    public adminService: AdminService,
    private validationService: ValidationService
  ) {}

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => {
        this.adminService.className = params.className;
        this.adminService.loadSchema();

        return this.adminService.getById(params.id);
      })
      .subscribe((object) => (this.object = object));

    // Bind 'this' since the submit function is a callback
    this.submitFunction = this.submit.bind(this);
  }

  submit(form: FormGroup) {
    const object = form.value;
    if (object) {
      // Before submitting form we need to delete any blank ObjectID fields
      // We can't send an empty string as an ObjectID
      for (let key of Object.keys(this.adminService.schema)) {
        if (
          (!object[key] || !object[key].length) &&
          ((this.adminService.schema[key].instance === "ObjectID" &&
            key !== "_id") ||
            key === "password")
        ) {
          delete object[key];
        }

        if (
          key === "password" &&
          object[key] &&
          object[key].length &&
          !object[key].match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)
        ) {
          const errors = {
            errors: {
              password: {
                message:
                  "Password must be at least 6 characters long, and contain a number.",
              },
            },
          };
          this.validationService.buildServerErrors(form, errors);
          return;
        }

        if (this.adminService.schema[key].instance === "Date" && object[key]) {
          object[key] = moment(object[key])
            .subtract(this.adminService.tzOffsetInHours, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        }

        if (
          this.adminService.schema[key].instance === "Boolean" &&
          !object[key]
        ) {
          object[key] = false;
        }
      }

      this.adminService
        .update(object)
        .then((response) => {
          this.router.navigate([
            `/admin/${this.adminService.className}`,
            object._id,
          ]);
        })
        .catch((err) => {
          const errors = err.json();
          this.toastr.error("There was an issue saving this.", "Whoops!");
          this.validationService.buildServerErrors(form, errors);
        });
    }
  }
}
