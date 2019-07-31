import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormItemType, FormModel, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService} from "./entity.service";
import {StructureData} from "../../model/structure-data.capsule";
import {CabinClassService} from "../entityClass/cabin-class.service";
import {CabinDefinition} from "../../model/cabin.description";
import {ReadCondition} from "../../model/device.description";

@Injectable()
export class CabinService extends EntityService<CabinDefinition> {

  REQUEST_EMPTY_CONDITION_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateEmptyCondition'];
  REQUEST_EXPORT_SINGLE_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateExportSingle'];


  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public cabinClassService: CabinClassService) {
    super(websocketService, httpService, formService, alertService, cabinClassService)
  }

  http_update_empty_condition(id: string, emptyCondition: ReadCondition, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_EMPTY_CONDITION_UPDATE,
      {
        id
      }, emptyCondition,
      callBack
    );
  }

  http_update_export_single(id: string, exportSingle: boolean, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_EXPORT_SINGLE_UPDATE,
      {
        id,
        exportSingle
      }, null,
      callBack
    );
  }

  emptyDescription(): CabinDefinition {
    return {
      exportSingle: true,
      emptyCondition: {
        matchAll: true,
        reads: []
      }
    };
  }

  getDataName(): string {
    return 'Cabin'
  }

  getShowName(): string {
    return 'Cabin'
  }

  getMenu(entity: StructureData<CabinDefinition>, parentId: string) {
    const inherit = super.getMenu(entity, parentId);
    if (entity) {
      inherit.push({
        label: 'Edit Export Mode',
        icon: 'ui-icon-edit',
        command: () => {
          this.editExportSingle(entity);
        }
      });
    }
    return inherit
  }

  editExportSingle(cabin: StructureData<CabinDefinition>) {
    const fm: FormModel = {
      title: 'Edit',
      action: 'Edit',
      windowWidth: 400,
      data: {
        exportSingle: cabin.description.exportSingle,
      },
      formItems: [
        {
          label: 'Export Single',
          name: 'exportSingle',
          type: FormItemType.CHECK
        }
      ],
      okFunction: () => {
        this.http_update_export_single(cabin.id, fm.data.exportSingle, () => {
          this.alertService.operationDone();
          this.formService.closeForm();
        });
      }
    };
    this.formService.popupForm(fm);
  }

  emptyConditionUpdate(cabin: StructureData<CabinDefinition>) {
    return (readCondition: ReadCondition) => {
      this.http_update_empty_condition(cabin.id, readCondition, () => {
        this.alertService.operationDone();
      });
    }
  }
}
