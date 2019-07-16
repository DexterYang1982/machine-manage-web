import {Injectable} from "@angular/core";
import {BaseStructureDateService} from "../base-structure-date.service";
import {FieldValueDescription} from "../../model/field-value-description";
import {StructureData, StructureDataCapsule} from "../../model/structure-data.capsule";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormItemType, FormModel, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";


@Injectable()
export class CustomFieldService extends BaseStructureDateService<FieldValueDescription> {

  REQUEST_ADD = ['POST', 'api/' + this.getDataName() + '/add'];
  REQUEST_UPDATE = ['PUT', 'api/' + this.getDataName() + '/update'];
  REQUEST_DELETE = ['DELETE', 'api/' + this.getDataName() + '/delete'];

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService) {
    super(websocketService);
  }

  http_add(nodeClassId: string, name: string, alias: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_ADD,
      {
        nodeClassId,
        name,
        alias
      }, null,
      callBack
    );
  }

  http_update(id: string, name: string, alias: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_UPDATE,
      {
        id,
        name,
        alias
      }, null,
      callBack
    );
  }

  http_delete(id: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_DELETE,
      {
        id
      }, null,
      callBack
    );
  }

  emptyDescription(): FieldValueDescription {
    return {
      output: false,
      valueDescriptions: []
    }
  }

  getDataName(): string {
    return 'CustomField'
  }

  getShowName(): string {
    return 'Custom Field'
  }

  fit(s: StructureDataCapsule): boolean {
    return s.dataName == this.getDataName()
  }

  getMenu(entityClass: { id: string }, field: StructureData<FieldValueDescription>) {
    return field ? [
      {
        label: 'Edit',
        icon: 'ui-icon-edit',
        command: () => {
          this.addOrEditField(entityClass, field);
        }
      },
      {
        label: 'Duplicate',
        icon: 'ui-icon-content-copy',
        command: () => {
        }
      },
      {
        label: 'Add Value Info',
        icon: 'ui-icon-description',
        command: () => {
        }
      },
      {
        label: 'Delete',
        icon: 'ui-icon-delete',
        command: () => {
          this.delete(field);
        }
      }
    ] : [{
      label: 'Add',
      icon: 'ui-icon-add',
      command: () => {
        this.addOrEditField(entityClass, null);
      }
    }];
  }

  delete(field: StructureData<FieldValueDescription>) {
    this.alertService.needToConfirm('Delete',
      field.name,
      () => {
        this.http_delete(field.id, () => {
          this.alertService.operationDone();
        });
      }
    );
  }


  addOrEditField(entityClass: { id: string }, field: StructureData<FieldValueDescription>) {
    const fm: FormModel = {
      title: field ? 'Edit Field' : 'Add Field',
      action: field ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        name: field ? field.name : '',
        alias: field ? field.alias : ''
      },
      formItems: [
        {
          label: 'Name',
          name: 'name',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Alias',
          name: 'alias',
          type: FormItemType.SINGLE_TEXT,
          required: true
        }
      ],
      okFunction: () => {
        if (field) {
          this.http_update(field.id, fm.data.name, fm.data.alias, () => {
            this.formService.closeForm();
          });
        } else {
          this.http_add(entityClass.id, fm.data.name, fm.data.alias, () => {
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }
}
