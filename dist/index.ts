import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnapJSAdminModule } from './admin/admin.module';

export * from './admin/admin.module';

@NgModule({
  imports: [
    CommonModule,
    SnapJSAdminModule
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class AdminModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AdminModule,
      providers: []
    };
  }
}
