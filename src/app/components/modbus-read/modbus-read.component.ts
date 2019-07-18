import {Component, Input, OnInit} from '@angular/core';
import {DeviceDefinition, ModbusRead} from "../../core/model/device.description";
import {ModbusUnitService} from "../../core/service/entity/modbus-unit.service";
import {StructureData} from "../../core/model/structure-data.capsule";
import {DeviceService} from "../../core/service/entity/device.service";
import {ModbusUnitDescription} from "../../core/model/modbus-unit.description";
import {MenuService} from "../../core/util/menu.service";

@Component({
  selector: 'app-modbus-read',
  templateUrl: './modbus-read.component.html',
  styleUrls: ['./modbus-read.component.css']
})
export class ModbusReadComponent implements OnInit {
  @Input()
  device: StructureData<DeviceDefinition>;
  @Input()
  modbusRead: ModbusRead;

  getModbusUnitName(modbusUnitId:string):string{
    return this.modbusUnitService.getOrCreateById(modbusUnitId).name;
  }
  getReadPointName(readPointId: string): string {
    const unit = this.modbusUnitService.getOrCreateById(this.modbusRead.modbusUnitId);
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
              public menuService: MenuService,
              public deviceService: DeviceService) {
  }

  ngOnInit() {
  }

}
