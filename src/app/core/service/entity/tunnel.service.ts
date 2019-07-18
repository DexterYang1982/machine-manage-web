import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService} from "./entity.service";
import {StructureData} from "../../model/structure-data.capsule";
import {TunnelClassService} from "../entityClass/tunnel-class.service";

@Injectable()
export class TunnelService extends EntityService<string> {

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public tunnelClassService: TunnelClassService) {
    super(websocketService, httpService, formService, alertService, tunnelClassService)
  }

  emptyDescription(): string {
    return '';
  }

  getDataName(): string {
    return 'Tunnel'
  }

  getShowName(): string {
    return 'Tunnel'
  }

  getMenu(entity: StructureData<string>, parentId: string) {
    const inherit = super.getMenu(entity, parentId);
    if (entity) {
      // inherit.push();
    }
    return inherit
  }
}
