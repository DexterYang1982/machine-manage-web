import {Component, Input, OnInit} from '@angular/core';
import {ModbusUnitService} from "../../core/service/entity/modbus-unit.service";
import {ModbusUnitDescription} from "../../core/model/modbus-unit.description";
import {MenuService} from "../../core/util/menu.service";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-modbus-read',
  templateUrl: './modbus-read.component.html',
  styleUrls: ['./modbus-read.component.css']
})
export class ModbusReadComponent implements OnInit {
  @Input()
  menu:MenuItem[];
  @Input()
  modbusUnitId:string;
  @Input()
  readPointId:string;

  getModbusUnitName(modbusUnitId:string):string{
    return this.modbusUnitService.getOrCreateById(modbusUnitId).name;
  }
  getReadPointName(modbusUnitId:string,readPointId: string): string {
    const unit = this.modbusUnitService.getOrCreateById(modbusUnitId);
    if (unit) {
      const unitClass = this.modbusUnitService.entityClassService.getOrCreateById(unit.nodeClassId);
      if (unitClass) {
        const readPoint = (unitClass.description as ModbusUnitDescription).read.find(it => it.id == readPointId);
        if (readPoint) {
          return readPoint.name
        }
      }
    }
    return ''
  }

  constructor(public modbusUnitService: ModbusUnitService,
              public menuService: MenuService) {
  }

  ngOnInit() {
  }

}
