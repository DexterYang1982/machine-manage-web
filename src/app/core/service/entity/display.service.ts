import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService} from "./entity.service";
import {StructureData} from "../../model/structure-data.capsule";
import {DisplayClassService} from "../entityClass/display-class.service";

@Injectable()
export class DisplayService extends EntityService<string> {

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public displayClassService: DisplayClassService) {
    super(websocketService, httpService, formService, alertService, displayClassService)
  }

  emptyDescription(): string {
    return '';
  }

  getDataName(): string {
    return 'Display'
  }

  getShowName(): string {
    return 'Display'
  }

  getMenu(entity: StructureData<string>, parentId: string) {
    const inherit = super.getMenu(entity, parentId);
    if (entity) {
      // inherit.push();
    }
    return inherit
  }
}
