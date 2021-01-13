import { Component } from '@angular/core';
import { ConstantsService } from '../constants.service';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="admin-layout">
      <div class="wrapper">

        <!-- Navbar -->
        <nav class="navbar navbar-default navbar-fixed-top">
          <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false" (click)="isCollapsed = !isCollapsed">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" ui-sref="admin-list({ className: 'User' })">&nbsp;</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div [class.collapse]="isCollapsed" class="navbar-collapse" id="navbar-collapse">
              <ul class="nav navbar-nav navbar-right">

                <!-- These are only displayed when the nav is collapsed -->
                <li *ngFor="let item of constants.SIDEBAR_ITEMS" class="collapsed-display">
                  <a [routerLink]="['/admin', item.class]">
                    <i class="fa fa-circle fa=fw"></i>&nbsp;&nbsp; {{item.title}}
                  </a>
                </li>

                <!-- Single button -->
                <li class="dropdown" uib-dropdown>
                  <a id="single-button" type="button">
                    <span *ngIf="!isLoggedIn()" [routerLink]="['/auth/login']">Login</span>
                    <span *ngIf="isLoggedIn()" [routerLink]="['/auth/logout']">Logout</span>
                  </a>
                </li>

              </ul>
            </div><!-- /.navbar-collapse -->
          </div><!-- /.container-fluid -->
        </nav>

        <!-- Sidebar -->
        <div class="sidebar-wrapper">
          <ul class="sidebar-nav">
            <li role="separator" class="divider">Navigation</li>
            <li *ngFor="let item of constants.SIDEBAR_ITEMS">
              <a [routerLink]="['/admin', item.class]">
                <i class="fa fa-circle fa=fw"></i>&nbsp;&nbsp; {{item.title}}
              </a>
            </li>
          </ul>
        </div>
        <!-- /#sidebar-wrapper -->

        <!-- Page Content -->
        <div class="page-content-wrapper">
          <router-outlet></router-outlet>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /deep/ .admin-layout{position:fixed;overflow-y:scroll;-webkit-overflow-scrolling:touch;height:100%;width:100%;background:#dbdfe2}/deep/ .admin-layout th{white-space:nowrap}/deep/ .admin-layout .wrapper{padding-top:50px;padding-left:0;-webkit-transition:all 0.5s ease;-moz-transition:all 0.5s ease;-o-transition:all 0.5s ease;transition:all 0.5s ease}/deep/ .admin-layout .wrapper.toggled{padding-left:220px}/deep/ .admin-layout .sidebar-wrapper{z-index:1000;position:fixed;left:220px;width:0;height:100%;margin-left:-220px;overflow-y:auto;background:#3b4146;-webkit-transition:all 0.5s ease;-moz-transition:all 0.5s ease;-o-transition:all 0.5s ease;transition:all 0.5s ease}/deep/ .admin-layout .wrapper.toggled .sidebar-wrapper{width:220px}/deep/ .admin-layout .page-content-wrapper{width:100%;position:absolute;padding-top:15px}/deep/ .admin-layout .wrapper.toggled .page-content-wrapper{position:absolute;margin-right:-220px}/deep/ .admin-layout .page-header{border:none;margin:0;padding-right:100px;position:relative}/deep/ .admin-layout .page-header h1{margin-top:0;font-size:2em}/deep/ .admin-layout .page-header .actions{position:absolute;top:0;right:0;text-align:right}/deep/ .admin-layout .navbar{background:#fff;border-bottom:solid 1px rgba(0,0,0,0.2)}/deep/ .admin-layout .navbar a{color:#666}/deep/ .admin-layout .navbar-brand{position:absolute;top:0;left:0;height:51px;width:220px;margin-left:0 !important;color:#2e3539;overflow:hidden;white-space:nowrap;-webkit-transition:all 0.5s ease;-moz-transition:all 0.5s ease;-o-transition:all 0.5s ease;transition:all 0.5s ease}/deep/ .admin-layout .navbar-collapse{-webkit-box-shadow:0 2px 4px 0 rgba(0,0,0,0.19);-moz-box-shadow:0 2px 4px 0 rgba(0,0,0,0.19);box-shadow:0 2px 4px 0 rgba(0,0,0,0.19)}/deep/ .admin-layout .navbar-collapse .collapsed-display{display:block}/deep/ .admin-layout .sidebar-nav{position:absolute;top:0;width:220px;margin:0;padding:0;list-style:none}/deep/ .admin-layout .sidebar-nav li.divider{padding:16px 16px 4px;font-size:0.9em;color:rgba(255,255,255,0.3);border-top:solid 1px rgba(0,0,0,0.1)}/deep/ .admin-layout .sidebar-nav li a{display:block;padding:14px 12px 14px 20px;text-decoration:none;color:#c8c8c8;-webkit-transition:all 0.5s ease;-moz-transition:all 0.5s ease;-o-transition:all 0.5s ease;transition:all 0.5s ease}/deep/ .admin-layout .sidebar-nav li a.active{border-left:solid 4px #222;color:#fff}/deep/ .admin-layout .sidebar-nav li a:hover{text-decoration:none;color:#fff;background:rgba(0,0,0,0.1)}/deep/ .admin-layout .sidebar-nav li a:active,/deep/ .admin-layout .sidebar-nav li a:focus{text-decoration:none}/deep/ .admin-layout .sidebar-nav>.sidebar-brand{height:65px;font-size:18px;line-height:60px}/deep/ .admin-layout .sidebar-nav>.sidebar-brand a{color:#999}/deep/ .admin-layout .sidebar-nav>.sidebar-brand a:hover{color:#fff;background:none}/deep/ .admin-layout .panel-title{padding:8px 4px 18px;border-bottom:solid 1px #eee}/deep/ .admin-layout .panel-title{font-weight:normal;color:#777}/deep/ .admin-layout .btn{border-radius:2px !important}/deep/ .admin-layout .custom-form .custom-object{border:1px solid #ededed;border-radius:10px;padding:5px;margin-bottom:10px;background:rgba(240,240,240,0.5)}/deep/ .admin-layout .list-group-item:first-child{border-top:none}/deep/ .admin-layout .list-group-item:last-child{border-bottom:none}/deep/ .admin-layout .list-group-item{border-radius:0;border-left:none;border-right:none}@media (min-width: 768px){/deep/ .admin-layout .wrapper{padding-left:220px}/deep/ .admin-layout .wrapper.toggled{padding-left:0}/deep/ .admin-layout .sidebar-wrapper{width:220px}/deep/ .admin-layout .wrapper.toggled .sidebar-wrapper{width:0}/deep/ .admin-layout .page-content-wrapper{padding-top:20px;position:relative}/deep/ .admin-layout .wrapper.toggled .page-content-wrapper{position:relative;margin-right:0}/deep/ .admin-layout .navbar-brand{color:rgba(255,255,255,0.5) !important;background:#2e3539 !important}/deep/ .admin-layout .navbar-collapse{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}/deep/ .admin-layout .navbar-collapse .collapsed-display{display:none}}@media (max-width: 580px){/deep/ .admin-layout .page-header{width:100%;padding-right:0px}/deep/ .admin-layout .page-header h1{width:100%}/deep/ .admin-layout .page-header .actions{width:100%;position:static}/deep/ .admin-layout .page-header .actions a{display:block;width:100%;margin:0 auto 9px auto}}
  `],
})
export class AdminLayoutComponent {
  isCollapsed = true;

  constructor(
    public constants: ConstantsService,
  ) { }

  /**
   * Checks if the user is logged in
   */
  isLoggedIn() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
}
