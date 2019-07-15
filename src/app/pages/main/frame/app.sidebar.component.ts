import {Component} from '@angular/core';
import {FrameComponent, SideBarTab} from "./frame.component";
import {ActivatedRoute, Router} from "@angular/router";
import {entityClassServices, selectedEntityClass} from "../../../core/service/entityClass/entity-class.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './app.sidebar.component.html'
})
export class AppSideBarComponent {

  sideBarTab = SideBarTab;

  selectedEntityClass = selectedEntityClass;
  entityClassServices = entityClassServices;

  constructor(public app: FrameComponent,
              public route: ActivatedRoute,
              public router: Router) {
  }

  entityClass(dataName: string) {
    this.router.navigate(['entityClass/' + dataName], {relativeTo: this.route});
  }
}
