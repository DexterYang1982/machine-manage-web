import {Component} from '@angular/core';
import {FrameComponent} from "./frame.component";

@Component({
  selector: 'app-topbar',
  template: `
    <div class="topbar clearfix">
      <div class="logo">
        <a href="#">
          <img src="assets/layout/images/logo.png">
        </a>
      </div>
      <div class="app-name" style="color: whitesmoke;font-size: 24px;font-weight: bold">
        Machine Config
      </div>

      <a id="topbar-menu-button" href="#" (click)="app.onTopbarMenuButtonClick($event)">
        <i class="material-icons">menu</i>
      </a>

      <ul class="topbar-menu fadeInDown" [ngClass]="{'topbar-menu-visible': app.topbarMenuActive}">
        <li #profile class="profile-item" [ngClass]="{'active-topmenuitem':app.activeTopbarItem === profile}">
          <a href="#" (click)="app.onTopbarItemClick($event,profile)">
            <div class="profile-image">
              <img src="assets/layout/images/profile-image.png">
            </div>
            <div class="profile-info">
              <span class="topbar-item-name profile-name">Dexter Yang</span>
              <span class="topbar-item-name profile-role">System Admin</span>
            </div>
          </a>
          <ul class="fadeInDown">
            <li role="menuitem">
              <a href="#" (click)="app.onTopbarSubItemClick($event)">
                <i class="material-icons">power_settings_new</i>
                <span>Switch Server</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  `
})
export class AppTopbarComponent {
  constructor(public app: FrameComponent) {
  }

}
