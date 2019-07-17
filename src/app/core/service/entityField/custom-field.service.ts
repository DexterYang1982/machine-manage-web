import {Injectable} from "@angular/core";
import {BaseStructureDateService} from "../base-structure-date.service";
import {FieldValueDescription, ValueDescription} from "../../model/field-value.description";
import {StructureData, StructureDataCapsule} from "../../model/structure-data.capsule";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormItemType, FormModel, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {generateId} from "../../util/utils";


@Injectable()
export class CustomFieldService extends BaseStructureDateService<FieldValueDescription> {

  REQUEST_ADD = ['POST', 'api/' + this.getDataName() + '/add'];
  REQUEST_UPDATE = ['PUT', 'api/' + this.getDataName() + '/update'];
  REQUEST_DELETE = ['DELETE', 'api/' + this.getDataName() + '/delete'];
  REQUEST_VALUE_DESCRIPTION_ADD = ['POST', 'api/' + this.getDataName() + '/addValueDescription'];
  REQUEST_VALUE_DESCRIPTION_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateValueDescription'];
  REQUEST_VALUE_DESCRIPTION_DELETE = ['DELETE', 'api/' + this.getDataName() + '/deleteValueDescription'];

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService) {
    super(websocketService);
  }

  http_add(nodeClassId: string, name: string, alias: string, output: boolean, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_ADD,
      {
        nodeClassId,
        name,
        alias,
        output
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

  http_value_description_add(id: string, valueDescription: ValueDescription, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_VALUE_DESCRIPTION_ADD,
      {
        id,
      }, valueDescription,
      callBack
    );
  }

  http_value_description_update(id: string, valueDescription: ValueDescription, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_VALUE_DESCRIPTION_UPDATE,
      {
        id
      }, valueDescription,
      callBack
    );
  }

  http_value_description_delete(id: string, valueDescriptionId: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_VALUE_DESCRIPTION_DELETE,
      {
        id,
        valueDescriptionId
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
          this.addOrEditValueDescription(field, null)
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

  getFieldValueDescriptionMenu(field: StructureData<FieldValueDescription>, valueDescription: ValueDescription) {
    return [
      {
        label: 'Edit',
        icon: 'ui-icon-edit',
        command: () => {
          this.addOrEditValueDescription(field, valueDescription);
        }
      },
      {
        label: 'Delete',
        icon: 'ui-icon-delete',
        command: () => {
          this.deleteValueDescription(field, valueDescription);
        }
      }
    ];
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


  deleteValueDescription(field: StructureData<FieldValueDescription>, valueDescription: ValueDescription) {
    this.alertService.needToConfirm('Delete',
      valueDescription.name,
      () => {
        this.http_value_description_delete(field.id, valueDescription.id, () => {
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
        alias: field ? field.alias : '',
        output: field ? field.description.output : false
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
        },
        {
          label: 'Output',
          name: 'output',
          type: FormItemType.CHECK,
          disabled: !!field
        }
      ],
      okFunction: () => {
        if (field) {
          this.http_update(field.id, fm.data.name, fm.data.alias, () => {
            this.formService.closeForm();
          });
        } else {
          this.http_add(entityClass.id, fm.data.name, fm.data.alias, fm.data.output, () => {
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }

  addOrEditValueDescription(field: StructureData<FieldValueDescription>, valueDescription: ValueDescription) {
    const fm: FormModel = {
      title: valueDescription ? 'Edit Field Value Description' : 'Add Field Value Description',
      action: valueDescription ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        id: valueDescription ? valueDescription.id : generateId(),
        name: valueDescription ? valueDescription.name : '',
        alias: valueDescription ? valueDescription.alias : '',
        valueExp: valueDescription ? valueDescription.valueExp : '',
        extra: valueDescription ? valueDescription.extra : '',
        color: valueDescription ? valueDescription.color : '#ffff00'
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
        },
        {
          label: 'Value Expression',
          name: 'valueExp',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Extra Info',
          name: 'extra',
          type: FormItemType.SINGLE_TEXT,
          required: false
        },
        {
          label: 'Color',
          name: 'color',
          type: FormItemType.COLOR,
          required: true
        }
      ],
      okFunction: () => {
        if (valueDescription) {
          this.http_value_description_update(field.id, fm.data, () => {
            this.formService.closeForm();
          });
        } else {
          this.http_value_description_add(field.id, fm.data, () => {
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }
}
