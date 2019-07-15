import {Injectable} from "@angular/core";
import {EntityClassService} from "./entity-class.service";
import {ModbusUnitDescription} from "../../model/modbus-unit-description";
import {StructureDataCapsule} from "../../model/structure-data.capsule";

@Injectable()
export class ModbusUnitClassService extends EntityClassService<ModbusUnitDescription> {


  emptyDescription(): ModbusUnitDescription {
    return {
      read: [],
      write: []
    }
  }

  fit(s: StructureDataCapsule): boolean {
    return s.dataName == 'ModbusUnitClass'
  }
}
