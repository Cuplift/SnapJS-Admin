import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlErrorsComponent } from './control-errors.component';
import { ValidationService } from './validation.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ControlErrorsComponent,
  ],
  providers: [
    ValidationService,
  ],
  exports: [
    ControlErrorsComponent,
  ],
})
export class ControlErrorsModule { }
