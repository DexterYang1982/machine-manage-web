import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormItemType, FormModel, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService} from "./entity.service";
import {StructureData} from "../../model/structure-data.capsule";
import {DeviceClassService} from "../entityClass/device-class.service";
import {DeviceDefinition, ModbusRead, ModbusWrite} from "../../model/device.description";
import {ModbusUnitService} from "./modbus-unit.service";
import {ModbusUnitClassService} from "../entityClass/modbus-unit-class.service";

@Injectable()
export class DeviceService extends EntityService<DeviceDefinition> {

  REQUEST_STATUS_ADD = ['POST', 'api/' + this.getDataName() + '/addStatus'];
  REQUEST_STATUS_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateStatus'];
  REQUEST_STATUS_DELETE = ['DELETE', 'api/' + this.getDataName() + '/deleteStatus'];

  REQUEST_COMMAND_ADD = ['POST', 'api/' + this.getDataName() + '/addCommand'];
  REQUEST_COMMAND_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateCommand'];
  REQUEST_COMMAND_DELETE = ['DELETE', 'api/' + this.getDataName() + '/deleteCommand'];

  http_add_command(id: string, modbusWrite: ModbusWrite, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_COMMAND_ADD,
      {
        id
      }, modbusWrite,
      callBack
    );
  }

  http_update_command(id: string, modbusWrite: ModbusWrite, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_COMMAND_UPDATE,
      {
        id
      }, modbusWrite,
      callBack
    );
  }

  http_delete_command(id: string, commandId: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_COMMAND_DELETE,
      {
        id,
        commandId
      }, null,
      callBack
    );
  }

  http_add_status(id: string, modbusRead: ModbusRead, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_STATUS_ADD,
      {
        id
      }, modbusRead,
      callBack
    );
  }

  http_update_status(id: string, modbusRead: ModbusRead, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_STATUS_UPDATE,
      {
        id
      }, modbusRead,
      callBack
    );
  }

  http_delete_status(id: string, statusId: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_STATUS_DELETE,
      {
        id,
        statusId
      }, null,
      callBack
    );
  }

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public deviceClassService: DeviceClassService,
              public modbusUnitClassService: ModbusUnitClassService,
              public modbusUnitService: ModbusUnitService) {
    super(websocketService, httpService, formService, alertService, deviceClassService)
  }

  emptyDescription(): DeviceDefinition {
    return {
      status: [],
      commands: [],
      processes: [],
      errorCondition: {
        matchAll: true,
        reads: []
      }
    };
  }

  getDataName(): string {
    return 'Device'
  }

  getShowName(): string {
    return 'Device'
  }

  getMenu(entity: StructureData<DeviceDefinition>, parentId: string) {
    const inherit = super.getMenu(entity, parentId);
    if (entity) {
      inherit.push({
        label: 'Add Status',
        icon: 'ui-icon-add',
        command: () => {
          this.addOrEditStatus(entity, null);
        }
      });
      inherit.push({
        label: 'Add Command',
        icon: 'ui-icon-add',
        command: () => {
          this.addOrEditCommand(entity, null);
        }
      });
    }
    return inherit
  }

  getStatusMenu(entity: StructureData<DeviceDefinition>, status: ModbusRead) {
    return [{
      label: 'Edit',
      icon: 'ui-icon-edit',
      command: () => {
        this.addOrEditStatus(entity, status);
      }
    }, {
      label: 'Delete',
      icon: 'ui-icon-add',
      command: () => {
        this.deleteStatus(entity, status);
      }
    }];
  }

  getCommandMenu(entity: StructureData<DeviceDefinition>, command: ModbusWrite) {
    return [{
      label: 'Edit',
      icon: 'ui-icon-edit',
      command: () => {
        this.addOrEditCommand(entity, command);
      }
    }, {
      label: 'Delete',
      icon: 'ui-icon-add',
      command: () => {
        this.deleteCommand(entity, command);
      }
    }];
  }

  deleteCommand(device: StructureData<DeviceDefinition>, command: ModbusWrite) {
    this.alertService.needToConfirm('Delete Command',
      '',
      () => {
        this.http_delete_command(device.id, command.id, () => {
          this.alertService.operationDone();
        });
      }
    );
  }

  addOrEditCommand(device: StructureData<DeviceDefinition>, command: ModbusWrite) {
    const writePointSelect = {
      label: 'Write Point',
      name: 'writePointId',
      type: FormItemType.SINGLE_SELECT,
      required: true,
      options: []
    };
    const fm: FormModel = {
      title: command ? 'Edit Device Command' : 'Add Device Command',
      action: command ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        id: command ? command.id : '',
        modbusUnitId: command ? command.modbusUnitId : null,
        writePointId: command ? command.writePointId : null
      },
      formItems: [
        {
          label: 'Modbus Unit',
          name: 'modbusUnitId',
          type: FormItemType.SINGLE_SELECT,
          required: true,
          options: this.modbusUnitService.getBySameMachine(device).map(it => {
            return {value: it.id, label: it.name};
          }),
          onValueChanged: (item) => {
            if(fm.data.modbusUnitId){
              const modbusUnit = this.modbusUnitService.get(fm.data.modbusUnitId);
              const modbusUnitClass = this.modbusUnitClassService.get(modbusUnit.nodeClassId);
              writePointSelect.options = modbusUnitClass.description.write.map(it => {
                return {value: it.id, label: it.name};
              });
            }
          }
        },
        writePointSelect
      ],
      okFunction: () => {
        if (command) {
          this.http_update_command(device.id, fm.data, () => {
            this.formService.closeForm();
          });
        } else {
          this.http_add_command(device.id, fm.data, () => {
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }


  deleteStatus(device: StructureData<DeviceDefinition>, status: ModbusRead) {
    this.alertService.needToConfirm('Delete Status',
      '',
      () => {
        this.http_delete_status(device.id, status.id, () => {
          this.alertService.operationDone();
        });
      }
    );
  }

  addOrEditStatus(device: StructureData<DeviceDefinition>, status: ModbusRead) {
    const readPointSelect = {
      label: 'Read Point',
      name: 'readPointId',
      type: FormItemType.SINGLE_SELECT,
      required: true,
      options: []
    };
    const fm: FormModel = {
      title: status ? 'Edit Device Status' : 'Add Device Status',
      action: status ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        id: status ? status.id : '',
        modbusUnitId: status ? status.modbusUnitId : null,
        readPointId: status ? status.readPointId : null
      },
      formItems: [
        {
          label: 'Modbus Unit',
          name: 'modbusUnitId',
          type: FormItemType.SINGLE_SELECT,
          required: true,
          options: this.modbusUnitService.getBySameMachine(device).map(it => {
            return {value: it.id, label: it.name};
          }),
          onValueChanged: (item) => {
            if (fm.data.modbusUnitId) {
              const modbusUnit = this.modbusUnitService.get(fm.data.modbusUnitId);
              const modbusUnitClass = this.modbusUnitClassService.get(modbusUnit.nodeClassId);
              readPointSelect.options = modbusUnitClass.description.read.map(it => {
                return {value: it.id, label: it.name};
              });
            }
          }
        },
        readPointSelect
      ],
      okFunction: () => {
        if (status) {
          this.http_update_status(device.id, fm.data, () => {
            this.formService.closeForm();
          });
        } else {
          this.http_add_status(device.id, fm.data, () => {
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }
}
