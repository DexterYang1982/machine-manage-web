import {Injectable} from "@angular/core";
import {EntityClassService} from "./entity-class.service";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";

@Injectable()
export class DisplayClassService extends EntityClassService<string> {

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService) {
    super(websocketService, httpService, formService, alertService)
  }

  emptyDescription(): string {
    return '';
  }

  getDataName(): string {
    return 'DisplayClass'
  }

  getShowName(): string {
    return 'Display Class'
  }

}
