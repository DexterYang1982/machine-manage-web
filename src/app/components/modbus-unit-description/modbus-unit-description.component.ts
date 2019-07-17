import {Component, Input, OnInit} from '@angular/core';
import {StructureData} from "../../core/model/structure-data.capsule";
import {ModbusUnitDescription} from "../../core/model/modbus-unit.description";
import {ModbusUnitClassService} from "../../core/service/entityClass/modbus-unit-class.service";
import {CustomFieldService} from "../../core/service/entityField/custom-field.service";
import {MenuService} from "../../core/util/menu.service";

@Component({
  selector: 'app-modbus-unit-description',
  templateUrl: './modbus-unit-description.component.html',
  styleUrls: ['./modbus-unit-description.component.css']
})
export class ModbusUnitDescriptionComponent implements OnInit {
  _modbusUnitClass: StructureData<ModbusUnitDescription>;
  @Input()
  set modbusUnitClass(v: StructureData<any>) {
    this._modbusUnitClass = this.modbusUnitClassService.get(v.id)
  }

  constructor(public modbusUnitClassService: ModbusUnitClassService,
              public menuService:MenuService,
              public customFieldService: CustomFieldService) {
  }

  ngOnInit() {
  }

  getCommandNames(value: string[]): string {
    return this._modbusUnitClass.description.write
      .filter(it => value.indexOf(it.id) > -1).map(it => it.name).join(' , ');
  }
}
