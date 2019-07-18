import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService} from "./entity.service";
import {StructureData} from "../../model/structure-data.capsule";
import {GroupClassService} from "../entityClass/group-class.service";
import {DisplayService} from "./display.service";
import {CabinService} from "./cabin.service";
import {DeviceService} from "./device.service";
import {TunnelService} from "./tunnel.service";

@Injectable()
export class GroupService extends EntityService<string> {

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public groupClassService: GroupClassService,
              public displayService: DisplayService,
              public cabinService: CabinService,
              public deviceService: DeviceService,
              public tunnelService: TunnelService) {
    super(websocketService, httpService, formService, alertService, groupClassService)
  }

  emptyDescription(): string {
    return '';
  }

  getDataName(): string {
    return 'Group'
  }

  getShowName(): string {
    return 'Group'
  }

  getMenu(entity: StructureData<string>, parentId: string) {
    const inherit = super.getMenu(entity, parentId);
    if (entity) {
      inherit.push({
        label: 'Add Display',
        icon: 'ui-icon-add',
        command: () => {
          this.displayService.addOrEdit(null, entity.id);
        }
      });
      inherit.push({
        label: 'Add Cabin',
        icon: 'ui-icon-add',
        command: () => {
          this.cabinService.addOrEdit(null, entity.id);
        }
      });
      inherit.push({
        label: 'Add Device',
        icon: 'ui-icon-add',
        command: () => {
          this.deviceService.addOrEdit(null, entity.id);
        }
      });
      inherit.push({
        label: 'Add Tunnel',
        icon: 'ui-icon-add',
        command: () => {
          this.tunnelService.addOrEdit(null, entity.id);
        }
      });
    }
    return inherit
  }
}
