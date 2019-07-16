import {Injectable} from "@angular/core";
import {EntityClassService} from "./entity-class.service";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {CustomFieldService} from "../entityField/custom-field.service";

@Injectable()
export class DeviceClassService extends EntityClassService<string> {

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public customFieldService:CustomFieldService) {
    super(websocketService, httpService, formService, alertService,customFieldService)
  }

  emptyDescription(): string {
    return '';
  }

  getDataName(): string {
    return 'DeviceClass'
  }

  getShowName(): string {
    return 'Device Class'
  }

}
