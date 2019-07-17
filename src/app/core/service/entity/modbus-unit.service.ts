import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService} from "./entity.service";
import {StructureData} from "../../model/structure-data.capsule";
import {ModbusUnitClassService} from "../entityClass/modbus-unit-class.service";

@Injectable()
export class ModbusUnitService extends EntityService<string> {

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public modbusUnitClassService: ModbusUnitClassService) {
    super(websocketService, httpService, formService, alertService, modbusUnitClassService)
  }

  emptyDescription(): string {
    return '';
  }

  getDataName(): string {
    return 'ModbusUnit'
  }

  getShowName(): string {
    return 'Modbus Unit'
  }

  getMenu(entity: StructureData<string>, parentId: string) {
    const inherit = super.getMenu(entity, parentId);
    if (entity) {
      // inherit.push();
    }
    return inherit
  }
}
