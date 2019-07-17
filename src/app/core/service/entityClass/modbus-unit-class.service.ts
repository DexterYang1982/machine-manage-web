import {Injectable} from "@angular/core";
import {EntityClassService} from "./entity-class.service";
import {ModbusUnitDescription, ReadPoint, WritePoint} from "../../model/modbus-unit.description";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormItemType, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {CustomFieldService} from "../entityField/custom-field.service";
import {StructureData} from "../../model/structure-data.capsule";

@Injectable()
export class ModbusUnitClassService extends EntityClassService<ModbusUnitDescription> {
  REQUEST_READ_POINT_ADD = ['POST', 'api/' + this.getDataName() + '/addReadPoint'];
  REQUEST_READ_POINT_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateReadPoint'];
  REQUEST_READ_POINT_DELETE = ['DELETE', 'api/' + this.getDataName() + '/deleteReadPoint'];

  REQUEST_WRITE_POINT_ADD = ['POST', 'api/' + this.getDataName() + '/addWritePoint'];
  REQUEST_WRITE_POINT_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateWritePoint'];
  REQUEST_WRITE_POINT_DELETE = ['DELETE', 'api/' + this.getDataName() + '/deleteWritePoint'];

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public customFieldService: CustomFieldService) {
    super(websocketService, httpService, formService, alertService, customFieldService)
  }

  emptyDescription(): ModbusUnitDescription {
    return {
      read: [],
      write: []
    }
  }

  getDataName(): string {
    return 'ModbusUnitClass'
  }

  getShowName(): string {
    return 'Modbus Unit Class'
  }

  getMemoryType(value: string): string {
    return READ_MEMORY_TYPE.find(it => it.value === value).label;
  }

  getCommandType(value: string): string {
    return COMMAND_TYPE.find(it => it.value === value).label;
  }


  http_read_point_add(id: string, readPoint: ReadPoint, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_READ_POINT_ADD,
      {
        id
      }, readPoint,
      callBack
    );
  }

  http_read_point_update(id: string, readPoint: ReadPoint, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_READ_POINT_UPDATE,
      {
        id
      }, readPoint,
      callBack
    );
  }

  http_read_point_delete(id: string, readPointId: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_READ_POINT_DELETE,
      {
        id,
        readPointId
      }, null,
      callBack
    );
  }

  http_write_point_add(id: string, writePoint: WritePoint, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_WRITE_POINT_ADD,
      {
        id
      }, writePoint,
      callBack
    );
  }

  http_write_point_update(id: string, writePoint: WritePoint, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_WRITE_POINT_UPDATE,
      {
        id
      }, writePoint,
      callBack
    );
  }

  http_write_point_delete(id: string, writePointId: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_WRITE_POINT_DELETE,
      {
        id,
        writePointId
      }, null,
      callBack
    );
  }

  getWritePointMenu(entityClass: StructureData<ModbusUnitDescription>, writePoint: WritePoint) {
    return [
      {
        label: 'Edit',
        icon: 'ui-icon-edit',
        command: () => {
          this.addOrEditWritePoint(entityClass, writePoint);
        }
      },
      {
        label: 'Delete',
        icon: 'ui-icon-delete',
        command: () => {
          this.deleteWritePoint(entityClass, writePoint);
        }
      }
    ];
  }


  getMenu(entityClass: StructureData<ModbusUnitDescription>) {
    const inherit = super.getMenu(entityClass);
    if (entityClass) {
      inherit.push({
        label: 'Add Read Point',
        icon: 'ui-icon-add',
        command: () => {
          this.addOrEditReadPoint(entityClass, null);
        }
      });
      inherit.push({
        label: 'Add Write Point',
        icon: 'ui-icon-add',
        command: () => {
          this.addOrEditWritePoint(entityClass, null);
        }
      });
    }
    return inherit
  }

  getReadPointMenu(entityClass: StructureData<ModbusUnitDescription>, readPoint: ReadPoint) {
    return [
      {
        label: 'Edit',
        icon: 'ui-icon-edit',
        command: () => {
          this.addOrEditReadPoint(entityClass, readPoint);
        }
      },
      {
        label: 'Delete',
        icon: 'ui-icon-delete',
        command: () => {
          this.deleteReadPoint(entityClass, readPoint);
        }
      }
    ];
  }

  deleteWritePoint(entityClass: StructureData<ModbusUnitDescription>, writePoint: WritePoint) {
    this.alertService.needToConfirm('Delete',
      writePoint.name,
      () => {
        this.http_write_point_delete(entityClass.id, writePoint.id, () => {
          this.alertService.operationDone();
        });
      }
    );
  }

  addOrEditWritePoint(entityClass: StructureData<ModbusUnitDescription>, writePoint: WritePoint) {
    const fm = {
      title: writePoint ? 'Edit Write Point' : 'Add Write Point',
      action: writePoint ? 'Edit' : 'Add',
      windowWidth: 450,
      data: {
        name: writePoint ? writePoint.name : null,
        expired: writePoint ? writePoint.expired : null,
        position: writePoint ? writePoint.point.position : null,
        memoryType: writePoint ? writePoint.point.memoryType : null,
        commandType: writePoint ? writePoint.commandType : null,
        commandFieldId: writePoint ? writePoint.commandFieldId : null,
        resultFieldId: writePoint ? writePoint.resultFieldId : null,
      },
      formItems: [
        {
          label: 'Name',
          name: 'name',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Expired',
          name: 'expired',
          type: FormItemType.INT,
          required: true,
          validations: [
            (v) => {
              const expired = parseInt(fm.data[v.name], null);
              if (isNaN(expired)) {
                return 'Integer Only';
              } else if (expired < 0 || expired > 65535) {
                return '0-65535';
              } else {
                fm.data[v.name] = expired;
                return null;
              }
            }
          ]
        }, {
          label: 'Command Type',
          name: 'commandType',
          type: FormItemType.SINGLE_SELECT,
          options: COMMAND_TYPE,
          required: true
        }, {
          label: 'Command Field',
          name: 'commandFieldId',
          type: FormItemType.SINGLE_SELECT,
          options: this.customFieldService.getByParentId(entityClass.id).filter(field => !field.description.output).map(field => {
            return {label: field.name, value: field.id};
          }),
          required: true
        }, {
          label: 'Memory Type',
          name: 'memoryType',
          type: FormItemType.SINGLE_SELECT,
          options: WRITE_MEMORY_TYPE,
          required: true
        },
        {
          label: 'Position',
          name: 'position',
          type: FormItemType.INT,
          required: true,
          validations: [
            (v) => {
              const position = parseInt(fm.data[v.name], null);
              if (isNaN(position)) {
                return 'Integer Only';
              } else if (position < 0 || position > 65536) {
                return '0-65535';
              } else {
                fm.data[v.name] = position;
                return null;
              }
            }
          ]
        },
        {
          label: 'Result Field',
          name: 'resultFieldId',
          type: FormItemType.SINGLE_SELECT,
          options: this.customFieldService.getByParentId(entityClass.id).filter(field => field.description.output)
            .filter(field => entityClass.description.read
              .find(r => r.resultFieldId === field.id) === undefined)
            .filter(field => entityClass.description.write
              .find(w => w.resultFieldId === field.id && w !== writePoint) === undefined)
            .map(field => {
              return {label: field.name, value: field.id};
            }),
          required: true
        }
      ],
      okFunction: () => {
        const wp = writePoint ? writePoint : {
          id: '',
          name: '',
          expired: 3000,
          point: {
            position: 0,
            quantity: 1,
            memoryType: ''
          },
          commandType: '',
          commandFieldId: '',
          resultFieldId: ''
        };
        wp.name = fm.data['name'];
        wp.expired = fm.data['expired'];
        wp.point.position = fm.data['position'];
        wp.point.memoryType = fm.data['memoryType'];
        wp.commandType = fm.data['commandType'];
        wp.commandFieldId = fm.data['commandFieldId'];
        wp.resultFieldId = fm.data['resultFieldId'];
        if (writePoint) {
          this.http_write_point_update(entityClass.id, wp, () => {
            this.formService.closeForm();
          });
        } else {
          this.http_write_point_add(entityClass.id, wp, () => {
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }

  deleteReadPoint(entityClass: StructureData<ModbusUnitDescription>, readPoint: ReadPoint) {
    this.alertService.needToConfirm('Delete',
      readPoint.name,
      () => {
        this.http_read_point_delete(entityClass.id, readPoint.id, () => {
          this.alertService.operationDone();
        });
      }
    );
  }

  addOrEditReadPoint(entityClass: StructureData<ModbusUnitDescription>, readPoint: ReadPoint) {
    const fm = {
      title: readPoint ? 'Edit Read Point' : 'Add Read Point',
      action: readPoint ? 'Edit' : 'Add',
      windowWidth: 450,
      data: {
        name: readPoint ? readPoint.name : null,
        position: readPoint ? readPoint.point.position : null,
        quantity: readPoint ? readPoint.point.quantity : null,
        memoryType: readPoint ? readPoint.point.memoryType : null,
        resultFieldId: readPoint ? readPoint.resultFieldId : null,
        sessionFollowWritePoints: readPoint ? readPoint.sessionFollowWritePoints : []
      },
      formItems: [
        {
          label: 'Name',
          name: 'name',
          type: FormItemType.SINGLE_TEXT,
          required: true
        }, {
          label: 'Memory Type',
          name: 'memoryType',
          type: FormItemType.SINGLE_SELECT,
          options: READ_MEMORY_TYPE,
          required: true
        },
        {
          label: 'Position',
          name: 'position',
          type: FormItemType.INT,
          required: true,
          validations: [
            (v) => {
              const position = parseInt(fm.data[v.name], null);
              if (isNaN(position)) {
                return 'Integer Only';
              } else if (position < 0 || position > 65536) {
                return '0-65535';
              } else {
                fm.data[v.name] = position;
                return null;
              }
            }
          ]
        }, {
          label: 'Quantity',
          name: 'quantity',
          type: FormItemType.INT,
          required: true,
          validations: [
            (v) => {
              const quantity = parseInt(fm.data[v.name], null);
              if (isNaN(quantity)) {
                return 'Integer Only';
              } else if (quantity < 1 || quantity > 125) {
                return '1-125';
              } else {
                fm.data[v.name] = quantity;
                return null;
              }
            }
          ]
        },
        {
          label: 'Result Field',
          name: 'resultFieldId',
          type: FormItemType.SINGLE_SELECT,
          options: this.customFieldService.getByParentId(entityClass.id).filter(field => field.description.output)
            .filter(field => entityClass.description.read
              .find(r => r.resultFieldId === field.id && r !== readPoint) === undefined)
            .filter(field => entityClass.description.write
              .find(w => w.resultFieldId === field.id) === undefined)
            .map(field => {
              return {label: field.name, value: field.id};
            }),
          required: true
        },
        {
          label: 'Session Follows',
          name: 'sessionFollowWritePoints',
          type: FormItemType.MULTI_SELECT,
          required: false,
          options: entityClass.description.write.map(writePoint => {
            return {
              label: writePoint.name,
              value: writePoint.id
            };
          })
        }
      ],
      okFunction: () => {
        const rp = readPoint ? readPoint : {
          id: '',
          name: '',
          point: {
            position: 0,
            quantity: 1,
            memoryType: ''
          },
          resultFieldId: '',
          sessionFollowWritePoints: []
        };
        rp.name = fm.data['name'];
        rp.point.position = fm.data['position'];
        rp.point.quantity = fm.data['quantity'];
        rp.point.memoryType = fm.data['memoryType'];
        rp.resultFieldId = fm.data['resultFieldId'];
        rp.sessionFollowWritePoints = fm.data['sessionFollowWritePoints'];
        if (readPoint) {
          this.http_read_point_update(entityClass.id, rp, () => {
            this.formService.closeForm();
          });
        } else {
          this.http_read_point_add(entityClass.id, rp, () => {
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }
}


export const WRITE_MEMORY_TYPE = [
  {
    label: 'Holding Register', value: 'HOLDING_REGISTER'
  },
  {
    label: 'Coil ClientStatus', value: 'COIL_STATUS'
  }
];
export const READ_MEMORY_TYPE = [
  {
    label: 'Holding Register', value: 'HOLDING_REGISTER'
  },
  {
    label: 'Coil ClientStatus', value: 'COIL_STATUS'
  },
  {
    label: 'Input ClientStatus', value: 'INPUT_STATUS'
  },
  {
    label: 'Input Register', value: 'INPUT_REGISTER'
  }
];
export const COMMAND_TYPE = [
  {
    label: 'Instant', value: 'INSTANT'
  },
  {
    label: 'Persistent', value: 'PERSISTENT'
  }
];
