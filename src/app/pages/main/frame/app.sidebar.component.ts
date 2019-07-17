import {Component} from '@angular/core';
import {FrameComponent, SideBarTab} from "./frame.component";
import {ActivatedRoute, Router} from "@angular/router";
import {entityClassServices, selectedEntityClass} from "../../../core/service/entityClass/entity-class.service";
import {MachineService} from "../../../core/service/entity/machine.service";
import {StructureData} from "../../../core/model/structure-data.capsule";
import {MachineClassService} from "../../../core/service/entityClass/machine-class.service";
import {MenuService} from "../../../core/util/menu.service";
import {ServerEntryService} from "../../../core/util/server-entry.service";

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
              public machineService: MachineService,
              public serverEntryService: ServerEntryService,
              public machineClassService: MachineClassService,
              public menuService:MenuService,
              public router: Router) {
  }

  entityClass(dataName: string) {
    this.router.navigate(['entityClass/' + dataName], {relativeTo: this.route});
  }
  machineConfig(machine:StructureData<any>){
    this.router.navigate(['machine/' + machine.id], {relativeTo: this.route});
  }
}
