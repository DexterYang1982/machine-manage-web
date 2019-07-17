import {Injectable} from "@angular/core";
import {EntityClassService} from "./entity-class.service";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormItemType, FormModel, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {CustomFieldService} from "../entityField/custom-field.service";
import {DisplayClientVersion} from "../../model/display-client-version.description";
import {StructureData} from "../../model/structure-data.capsule";

@Injectable()
export class DisplayClassService extends EntityClassService<DisplayClientVersion> {
  REQUEST_CLIENT_VERSION_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateDisplayClientVersion'];

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public customFieldService: CustomFieldService) {
    super(websocketService, httpService, formService, alertService, customFieldService)
  }

  emptyDescription(): DisplayClientVersion {
    return {
      name: '',
      version: '',
      location: ''
    };
  }

  getDataName(): string {
    return 'DisplayClass'
  }

  getShowName(): string {
    return 'Display Class'
  }


  http_client_version_update(id: string, displayClientVersion: DisplayClientVersion, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_CLIENT_VERSION_UPDATE,
      {
        id
      }, displayClientVersion,
      callBack
    );
  }

  getMenu(entityClass: StructureData<DisplayClientVersion>) {
    const inherit = super.getMenu(entityClass);
    if (entityClass) {
      inherit.push({
        label: 'Edit Client Version',
        icon: 'ui-icon-edit',
        command: () => {
          this.editClientVersion(entityClass);
        }
      });
    }
    return inherit
  }

  editClientVersion(entityClass: StructureData<DisplayClientVersion>) {
    const fm: FormModel = {
      title: 'Edit Client Version',
      action: 'Edit',
      windowWidth: 400,
      data: Object.assign({}, entityClass.description),
      formItems: [
        {
          label: 'Name',
          name: 'name',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Version',
          name: 'version',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Location',
          name: 'location',
          type: FormItemType.SINGLE_TEXT,
          required: true
        }
      ],
      okFunction: () => {
        this.http_client_version_update(entityClass.id, fm.data, () => {
          this.formService.closeForm();
        });
      }
    };
    this.formService.popupForm(fm);
  }

}
