import {Injectable} from "@angular/core";
import {ModbusUnitService} from "./modbus-unit.service";
import {ModbusUnitDescription, ReadPoint, WritePoint} from "../../model/modbus-unit.description";
import {ValueDescription} from "../../model/field-value.description";
import {CustomFieldService} from "../entityField/custom-field.service";


@Injectable()
export class ModbusService {

  constructor(private modbusUnitService: ModbusUnitService,
              private customFieldService: CustomFieldService) {

  }

  getModbusUnitName(modbusUnitId: string): string {
    return this.modbusUnitService.getOrCreateById(modbusUnitId).name;
  }

  getReadPoint(modbusUnitId: string, readPointId: string): ReadPoint {
    const unit = this.modbusUnitService.getOrCreateById(modbusUnitId);
    if (unit) {
      const unitClass = this.modbusUnitService.entityClassService.getOrCreateById(unit.nodeClassId);
      if (unitClass) {
        const readPoint = (unitClass.description as ModbusUnitDescription).read.find(it => it.id == readPointId);
        if (readPoint) {
          return readPoint
        }
      }
    }
    return null
  }

  getReadPointName(modbusUnitId: string, readPointId: string): string {
    const readPoint = this.getReadPoint(modbusUnitId, readPointId);
    return readPoint ? readPoint.name : ''
  }

  getWritePoint(modbusUnitId: string, writePointId: string): WritePoint {
    const unit = this.modbusUnitService.getOrCreateById(modbusUnitId);
    if (unit) {
      const unitClass = this.modbusUnitService.entityClassService.getOrCreateById(unit.nodeClassId);
      if (unitClass) {
        const writePoint = (unitClass.description as ModbusUnitDescription).write.find(it => it.id == writePointId);
        if (writePoint) {
          return writePoint
        }
      }
    }
    return null
  }

  getWritePointName(modbusUnitId: string, writePointId: string): string {
    const writePoint = this.getWritePoint(modbusUnitId, writePointId);
    return writePoint ? writePoint.name : ''
  }

  getRWPointValueDescription(modbusUnitId: string, resultFieldId: string): ValueDescription[] {
    const unit = this.modbusUnitService.getOrCreateById(modbusUnitId);
    if (unit) {
      const field = this.customFieldService.getByParentId(unit.nodeClassId).find(it => it.id == resultFieldId);
      return field ? field.description.valueDescriptions : []
    }
    return []
  }

}
