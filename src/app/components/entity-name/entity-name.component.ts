import {Component, Input, OnInit} from '@angular/core';
import {EntityService, entityServiceMap} from "../../core/service/entity/entity.service";
import {MenuItem} from "primeng/api";
import {MenuService} from "../../core/util/menu.service";
import {StructureData} from "../../core/model/structure-data.capsule";

@Component({
  selector: 'app-entity-name',
  templateUrl: './entity-name.component.html',
  styleUrls: ['./entity-name.component.css']
})
export class EntityNameComponent implements OnInit {
  @Input()
  menu: MenuItem[];

  @Input()
  entity:StructureData<any>;

  getEntityClassName(dataName: string, entityClassId: string): string {
    if (dataName && dataName.length > 0 && entityClassId && entityClassId.length > 0) {
      return (entityServiceMap [dataName] as EntityService<any>).entityClassService.getOrCreateById(entityClassId).name
    } else {
      return ''
    }
  }

  constructor(private menuService: MenuService) {
  }

  ngOnInit() {
  }

  doClick(event) {
    if (this.menu) {
      this.menuService.showMenu(this.menu, event);
    }
  }

}
