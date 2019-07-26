import {Component, Input, OnInit} from '@angular/core';
import {EmbeddedField, RuntimeData} from "../../core/service/runtime-data-sync.service";
import {MenuItem} from "primeng/api";
import {MenuService} from "../../core/util/menu.service";

@Component({
  selector: 'app-runtime-entity-field-value',
  templateUrl: './runtime-entity-field-value.component.html',
  styleUrls: ['./runtime-entity-field-value.component.css']
})
export class RuntimeEntityFieldValueComponent implements OnInit {
  embeddedField = EmbeddedField;
  @Input()
  showEntity: boolean;

  @Input()
  executionTime: number;

  @Input()
  info: { entity: { id: string, name: string, dataName: string }, fieldName: string, fieldKey: string, runtimeData: RuntimeData<any>, menu?: MenuItem[] };

  constructor(public menuService: MenuService) {
  }

  ngOnInit() {
  }

  fit(restriction: { dataName: string, fieldName: string, fieldKey: string }[]): boolean {
    if (restriction[0].dataName == null && restriction[0].fieldKey == this.info.fieldKey) {
      //custom
      return true;
    }
    return restriction.find(it => this.info.entity.dataName == it.dataName && this.info.fieldKey == it.fieldKey) != null
  }

  showMenu($event) {
    if (this.info.menu != null) {
      this.menuService.showMenu(this.info.menu, $event);
    }
  }

}
