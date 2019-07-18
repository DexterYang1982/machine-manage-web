import {BaseStructureDateService} from "../base-structure-date.service";
import {StructureData, StructureDataCapsule} from "../../model/structure-data.capsule";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormItemType, FormModel, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityClassService} from "../entityClass/entity-class.service";

export const entityServiceMap = {};

export abstract class EntityService<T> extends BaseStructureDateService<T> {
  getBySameGroup(entity: StructureData<any>) {
    const groupId = entity.path.length > 3 ? entity.path[3] : null;
    return groupId ? this.data.filter(it => it.path.indexOf(groupId) > 0) : []
  }

  getBySameMachine(entity: StructureData<any>) {
    const groupId = entity.path.length > 2 ? entity.path[2] : null;
    return groupId ? this.data.filter(it => it.path.indexOf(groupId) > 0) : []
  }

  fit(s: StructureDataCapsule): boolean {
    return s.dataName == this.getDataName();
  }

  REQUEST_ADD = ['POST', 'api/' + this.getDataName() + '/add'];
  REQUEST_UPDATE = ['PUT', 'api/' + this.getDataName() + '/update'];
  REQUEST_DELETE = ['DELETE', 'api/' + this.getDataName() + '/delete'];

  protected constructor(public websocketService: StructureDataSyncService,
                        public httpService: HttpService,
                        public formService: FormService,
                        public alertService: AlertService,
                        public entityClassService: EntityClassService<any>) {
    super(websocketService);
    entityServiceMap[this.getDataName()] = this;
  }

  http_add(parentId: string, entityClassId: string, name: string, alias: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_ADD,
      {
        parentId, entityClassId, name, alias
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

  getMenu(entity: StructureData<any>, parentId: string) {
    return entity ? [
      {
        label: 'Edit',
        icon: 'ui-icon-edit',
        command: () => {
          this.addOrEdit(entity, null);
        }
      },
      {
        label: 'Delete',
        icon: 'ui-icon-delete',
        command: () => {
          this.delete(entity);
        }
      }
    ] : [{
      label: 'Add',
      icon: 'ui-icon-add',
      command: () => {
        this.addOrEdit(entity, parentId);
      }
    }];
  }

  delete(entity: StructureData<any>) {
    this.alertService.needToConfirm('Delete',
      entity.name,
      () => {
        this.http_delete(entity.id, () => {
          this.alertService.operationDone();
        });
      }
    );
  }

  addOrEdit(entity: StructureData<any>, parentId: string) {
    const fm: FormModel = {
      title: entity ? 'Edit ' + entity.name : 'Add ' + this.getShowName(),
      action: entity ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        name: entity ? entity.name : '',
        alias: entity ? entity.alias : '',
        nodeClassId: entity ? entity.nodeClassId : ''
      },
      formItems: [
        {
          label: 'Entity Class',
          name: 'nodeClassId',
          type: FormItemType.SINGLE_SELECT,
          disabled: !!entity,
          required: true,
          options: this.entityClassService.data.map(it => {
            return {label: it.name, value: it.id}
          })
        },
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
        if (entity) {
          this.http_update(entity.id, fm.data.name, fm.data.alias, () => {
            this.formService.closeForm();
          });
        } else {
          this.http_add(parentId, fm.data.nodeClassId, fm.data.name, fm.data.alias, () => {
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }
}
