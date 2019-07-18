import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ModbusUnitDescription} from "../../core/model/modbus-unit.description";
import {ModbusUnitService} from "../../core/service/entity/modbus-unit.service";
import {MenuService} from "../../core/util/menu.service";

@Component({
  selector: 'app-modbus-write',
  templateUrl: './modbus-write.component.html',
  styleUrls: ['./modbus-write.component.css']
})
export class ModbusWriteComponent implements OnInit {

  @Input()
  menu:MenuItem[];
  @Input()
  modbusUnitId:string;
  @Input()
  writePointId:string;

  getModbusUnitName(modbusUnitId:string):string{
    return this.modbusUnitService.getOrCreateById(modbusUnitId).name;
  }
  getWritePointName(modbusUnitId:string,writePointId: string): string {
    const unit = this.modbusUnitService.getOrCreateById(modbusUnitId);
    if (unit) {
      const unitClass = this.modbusUnitService.entityClassService.getOrCreateById(unit.nodeClassId);
      if (unitClass) {
        const writePoint = (unitClass.description as ModbusUnitDescription).write.find(it => it.id == writePointId);
        if (writePoint) {
          return writePoint.name
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
