import {Component} from '@angular/core';
import {FrameComponent, SideBarTab} from "./frame.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './app.sidebar.component.html'
})
export class AppSideBarComponent {

  sideBarTab = SideBarTab;
  constructor(public app: FrameComponent) {
  }

}
