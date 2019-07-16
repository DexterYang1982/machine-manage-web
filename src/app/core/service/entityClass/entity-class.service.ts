import {BaseStructureDateService} from "../base-structure-date.service";
import {HttpService} from "../../util/http.service";
import {FormItemType, FormModel, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {StructureData, StructureDataCapsule} from "../../model/structure-data.capsule";

export const entityClassServiceMap = {};
export const entityClassServices: EntityClassService<any>[] = [];
export const selectedEntityClass = {
  dataName: null,
  id: null,
  data: null
};

export abstract class EntityClassService<T> extends BaseStructureDateService<T> {
  fit(s: StructureDataCapsule): boolean {
    return s.dataName == this.getDataName();
  }

  REQUEST_ADD = ['POST', 'api/' + this.getDataName() + '/add'];
  REQUEST_UPDATE = ['PUT', 'api/' + this.getDataName() + '/update'];
  REQUEST_DELETE = ['DELETE', 'api/' + this.getDataName() + '/delete'];

  protected constructor(public websocketService: StructureDataSyncService,
                        public httpService: HttpService,
                        public formService: FormService,
                        public alertService: AlertService) {
    super(websocketService);

    entityClassServiceMap[this.getDataName()] = this;
    entityClassServices.push(this);
  }

  http_add(name: string, alias: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_ADD,
      {
        name, alias
      }, null,
      callBack
    );
  }

  http_update(id: string, name: string, alias: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_UPDATE,
      {
        id, name, alias
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

  getMenu(entityClass: StructureData<any>) {
    return entityClass ? [
      {
        label: 'Edit',
        icon: 'ui-icon-edit',
        command: () => {
          this.addOrEdit(entityClass);
        }
      },
      {
        label: 'Duplicate',
        icon: 'ui-icon-content-copy',
        command: () => {
        }
      },
      {
        label: 'Delete',
        icon: 'ui-icon-delete',
        command: () => {
          this.delete(entityClass);
        }
      }
    ] : [{
      label: 'Add',
      icon: 'ui-icon-add',
      command: () => {
        this.addOrEdit(entityClass);
      }
    }];
  }

  delete(entityClass: StructureData<any>) {
    this.alertService.needToConfirm('Delete',
      entityClass.name,
      () => {
        this.http_delete(entityClass.id, () => {
          this.alertService.operationDone();
        });
      }
    );
  }

  addOrEdit(entityClass: StructureData<any>) {
    const fm: FormModel = {
      title: entityClass ? 'Edit ' + entityClass.name : 'Add ' + this.getShowName(),
      action: entityClass ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        name: entityClass ? entityClass.name : '',
        alias: entityClass ? entityClass.alias : ''
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
        if (entityClass) {
          this.http_update(entityClass.id, fm.data.name, fm.data.alias, () => {
            this.formService.closeForm();
          });
        } else {
          this.http_add(fm.data.name, fm.data.alias, () => {
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }
}
