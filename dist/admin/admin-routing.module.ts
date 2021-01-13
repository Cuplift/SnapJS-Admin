import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminDetailComponent } from './admin-detail/admin-detail.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AdminNewComponent } from './admin-new/admin-new.component';

const adminRoutes: Routes = [
  { path: 'admin',  component: AdminLayoutComponent,
    children: [
      { path: ':className',  component: AdminListComponent },
      { path: ':className/new',  component: AdminNewComponent },
      { path: ':className/:id',  component: AdminDetailComponent },
      { path: ':className/:id/edit',  component: AdminEditComponent },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(adminRoutes) ],
  exports: [ RouterModule ],
})
export class AdminRoutingModule { }
