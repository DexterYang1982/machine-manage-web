import {Injectable} from "@angular/core";
import {EntityClassService} from "./entity-class.service";
import {ModbusUnitDescription} from "../../model/modbus-unit-description";
import {StructureDataCapsule} from "../../model/structure-data.capsule";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";

@Injectable()
export class ModbusUnitClassService extends EntityClassService<ModbusUnitDescription> {

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService) {
    super(websocketService, httpService, formService, alertService)
  }

  emptyDescription(): ModbusUnitDescription {
    return {
      read: [],
      write: []
    }
  }
  getDataName(): string {
    return 'ModbusUnitClass'
  }

  getShowName(): string {
    return 'Modbus Unit Class'
  }

}
