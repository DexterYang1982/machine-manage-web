import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService} from "./entity.service";
import {MachineClassService} from "../entityClass/machine-class.service";
import {StructureData} from "../../model/structure-data.capsule";
import {ModbusSlaveService} from "./modbus-slave.service";
import {GroupService} from "./group.service";

@Injectable()
export class MachineService extends EntityService<string> {

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public machineClassService: MachineClassService,
              public modbusSlaveService: ModbusSlaveService,
              public groupService: GroupService) {
    super(websocketService, httpService, formService, alertService, machineClassService)
  }


  getBySameMachine(entity: StructureData<any>) {
    const machineId = entity.path.length > 2 ? entity.path[2] : null;
    return [this.getOrCreateById(machineId)]
  }

  emptyDescription(): string {
    return '';
  }

  getDataName(): string {
    return 'Machine'
  }

  getShowName(): string {
    return 'Machine'
  }

  getMenu(entity: StructureData<string>, parentId: string) {
    const inherit = super.getMenu(entity, parentId);
    if (entity) {
      inherit.push({
        label: 'Add Modbus Slave',
        icon: 'ui-icon-add',
        command: () => {
          this.modbusSlaveService.addOrEdit(null, entity.id);
        }
      });
      inherit.push({
        label: 'Add Group',
        icon: 'ui-icon-add',
        command: () => {
          this.groupService.addOrEdit(null, entity.id);
        }
      });
    }
    return inherit
  }
}
