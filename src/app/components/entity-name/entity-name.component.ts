import {Component, Input, OnInit} from '@angular/core';
import {StructureData} from "../../core/model/structure-data.capsule";
import {EntityService, entityServiceMap} from "../../core/service/entity/entity.service";
import {MenuItem} from "primeng/api";
import {MenuService} from "../../core/util/menu.service";

@Component({
  selector: 'app-entity-name',
  templateUrl: './entity-name.component.html',
  styleUrls: ['./entity-name.component.css']
})
export class EntityNameComponent implements OnInit {
  _entity: StructureData<any>;
  className: string;
  @Input()
  menu: MenuItem[];

  @Input()
  set entity(e: StructureData<any>) {
    this._entity = e;
    if (e) {
      this.className = (entityServiceMap [e.dataName] as EntityService<any>).entityClassService.getOrCreateById(e.nodeClassId).name
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
