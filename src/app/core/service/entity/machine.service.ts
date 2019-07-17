import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService} from "./entity.service";
import {MachineClassService} from "../entityClass/machine-class.service";
import {StructureData} from "../../model/structure-data.capsule";

@Injectable()
export class MachineService extends EntityService<string> {

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public machineClassService: MachineClassService) {
    super(websocketService, httpService, formService, alertService, machineClassService)
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
      // inherit.push();
    }
    return inherit
  }
}
