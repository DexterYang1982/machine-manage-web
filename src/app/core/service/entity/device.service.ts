import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormItemType, FormModel, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService, staticService} from "./entity.service";
import {StructureData} from "../../model/structure-data.capsule";
import {DeviceClassService} from "../entityClass/device-class.service";
import {
  DeviceDefinition,
  DeviceProcess,
  DeviceProcessStep,
  EntityWrite,
  ModbusRead,
  ModbusWrite,
  ReadCondition
} from "../../model/device.description";
import {ModbusUnitService} from "./modbus-unit.service";
import {ModbusUnitClassService} from "../entityClass/modbus-unit-class.service";
import {clone, generateId} from "../../util/utils";

@Injectable()
export class DeviceService extends EntityService<DeviceDefinition> {

  REQUEST_STATUS_ADD = ['POST', 'api/' + this.getDataName() + '/addStatus'];
  REQUEST_STATUS_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateStatus'];
  REQUEST_STATUS_DELETE = ['DELETE', 'api/' + this.getDataName() + '/deleteStatus'];

  REQUEST_COMMAND_ADD = ['POST', 'api/' + this.getDataName() + '/addCommand'];
  REQUEST_COMMAND_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateCommand'];
  REQUEST_COMMAND_DELETE = ['DELETE', 'api/' + this.getDataName() + '/deleteCommand'];

  REQUEST_PROCESS_ADD = ['POST', 'api/' + this.getDataName() + '/addProcess'];
  REQUEST_PROCESS_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateProcess'];
  REQUEST_PROCESS_DELETE = ['DELETE', 'api/' + this.getDataName() + '/deleteProcess'];

  REQUEST_ERROR_CONDITION_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateErrorCondition'];


  http_update_error_condition(id: string, errorCondition: ReadCondition, callBack: () => void) {
    console.log(errorCondition);
    this.httpService.http<any>(
      this.REQUEST_ERROR_CONDITION_UPDATE,
      {
        id
      }, errorCondition,
      callBack
    );
  }

  http_add_process(id: string, deviceProcess: DeviceProcess, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_PROCESS_ADD,
      {
        id
      }, deviceProcess,
      callBack
    );
  }

  http_update_process(id: string, deviceProcess: DeviceProcess, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_PROCESS_UPDATE,
      {
        id
      }, deviceProcess,
      callBack
    );
  }

  http_delete_process(id: string, processId: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_PROCESS_DELETE,
      {
        id,
        processId
      }, null,
      callBack
    );
  }

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
      inherit.push({
        label: 'Add Process',
        icon: 'ui-icon-add',
        command: () => {
          this.addOrEditProcessName(entity, null);
        }
      });
    }
    return inherit
  }


  errorConditionUpdate(device: StructureData<any>) {
    return (readCondition: ReadCondition) => {
      this.http_update_error_condition(device.id, readCondition, () => {
        this.alertService.operationDone();
      });
    }
  }

  processStepExecuteConditionUpdate(device: StructureData<any>, process: DeviceProcess, step: DeviceProcessStep) {
    return (readCondition: ReadCondition) => {
      const p = clone(process);
      p.steps.find(it => it.id == step.id).executeCondition = readCondition;
      this.http_update_process(device.id, p, () => {
        this.alertService.operationDone();
      });
    }
  }

  processStepEndConditionUpdate(device: StructureData<any>, process: DeviceProcess, step: DeviceProcessStep) {
    return (readCondition: ReadCondition) => {
      const p = clone(process);
      p.steps.find(it => it.id == step.id).endCondition = readCondition;
      this.http_update_process(device.id, p, () => {
        this.alertService.operationDone();
      });
    }
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

  getProcessMenu(entity: StructureData<DeviceDefinition>, process: DeviceProcess) {
    return [{
      label: 'Edit',
      icon: 'ui-icon-edit',
      command: () => {
        this.addOrEditProcessName(entity, process);
      }
    }, {
      label: 'Delete',
      icon: 'ui-icon-delete',
      command: () => {
        this.deleteProcess(entity, process);
      }
    }, {
      label: 'Add Step',
      icon: 'ui-icon-add',
      command: () => {
        this.addOrEditProcessStepName(entity, process, null);
      }
    }];
  }

  getProcessStepMenu(entity: StructureData<DeviceDefinition>, process: DeviceProcess, step: DeviceProcessStep) {
    return [{
      label: 'Edit',
      icon: 'ui-icon-edit',
      command: () => {
        this.addOrEditProcessStepName(entity, process, step);
      }
    }, {
      label: 'Add Write',
      icon: 'ui-icon-add',
      command: () => {
        staticService.readWriteServiceInstance.addOrEditEntityRW(entity, null, 'write', (write: EntityWrite) => {
          const p = clone(process);
          p.steps.find(it => it.id == step.id).writes.push(write);
          this.http_update_process(entity.id, p, () => {
            this.alertService.operationDone();
          });
        })
      }
    }, {
      label: 'Delete',
      icon: 'ui-icon-delete',
      command: () => {
        const p = clone(process);
        p.steps=p.steps.filter(s=>s.id!=step.id)
        this.http_update_process(entity.id, p, () => {
          this.alertService.operationDone();
        });
      }
    }];
  }

  getProcessStepWriteMenu(entity: StructureData<DeviceDefinition>, process: DeviceProcess, step: DeviceProcessStep, write: EntityWrite) {
    return [{
      label: 'Edit',
      icon: 'ui-icon-edit',
      command: () => {
        staticService.readWriteServiceInstance.addOrEditEntityRW(entity, write, 'write', (write_edit: EntityWrite) => {
          const process_edit = clone(process);
          const step_edit = clone(step);
          step_edit.writes = step_edit.writes.map(w => {
            if (w.id == write_edit.id)
              return write_edit;
            else
              return w;
          });
          process_edit.steps = process_edit.steps.map(s => {
            if (s.id == step_edit.id)
              return step_edit;
            else
              return s;
          });
          this.http_update_process(entity.id, process_edit, () => {
            this.alertService.operationDone();
          });
        })
      }
    }, {
      label: 'Delete',
      icon: 'ui-icon-delete',
      command: () => {
        const process_edit = clone(process);
        const step_edit = clone(step);
        step_edit.writes = step_edit.writes.filter(w => w.id != write.id);
        process_edit.steps = process_edit.steps.map(s => {
          if (s.id == step_edit.id)
            return step_edit;
          else
            return s;
        });
        this.http_update_process(entity.id, process_edit, () => {
          this.alertService.operationDone();
        });
      }
    }];
  }

  deleteProcess(device: StructureData<DeviceDefinition>, process: DeviceProcess) {
    this.alertService.needToConfirm('Delete Process',
      process.name,
      () => {
        this.http_delete_process(device.id, process.id, () => {
          this.alertService.operationDone();
        });
      }
    );
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


  addOrEditProcessName(device: StructureData<DeviceDefinition>, process: DeviceProcess) {
    const fm: FormModel = {
      title: status ? 'Edit Device Process' : 'Add Device Process',
      action: status ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        id: process ? process.id : '',
        name: process ? process.name : '',
      },
      formItems: [
        {
          label: 'Name',
          name: 'name',
          type: FormItemType.SINGLE_TEXT,
          required: true
        }
      ],
      okFunction: () => {
        if (process) {
          const p = clone(process);
          p.name = fm.data.name;
          this.http_update_process(device.id, p, () => {
            this.alertService.operationDone();
            this.formService.closeForm();
          });
        } else {
          this.http_add_process(device.id, {id: '', name: fm.data.name, steps: []}, () => {
            this.alertService.operationDone();
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
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
            if (fm.data.modbusUnitId) {
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
            this.alertService.operationDone();
            this.formService.closeForm();
          });
        } else {
          this.http_add_command(device.id, fm.data, () => {
            this.alertService.operationDone();
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
            this.alertService.operationDone();
            this.formService.closeForm();
          });
        } else {
          this.http_add_status(device.id, fm.data, () => {
            this.alertService.operationDone();
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }


  addOrEditProcessStepName(device: StructureData<DeviceDefinition>, process: DeviceProcess, step: DeviceProcessStep) {
    const fm: FormModel = {
      title: status ? 'Edit Process Step' : 'Add Process Step',
      action: status ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        id: step ? step.id : '',
        name: step ? step.name : '',
        timeout: step ? step.timeout : 60000
      },
      formItems: [
        {
          label: 'Name',
          name: 'name',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Time Out',
          name: 'timeout',
          type: FormItemType.SINGLE_TEXT,
          required: true
        }
      ],
      okFunction: () => {
        const p = clone(process);
        if (step) {
          const s = p.steps.find(it => it.id == step.id);
          s.name = fm.data.name;
          s.timeout = fm.data.timeout;
        } else {
          p.steps.push({
            id: generateId(),
            name: fm.data.name,
            timeout: fm.data.timeout,
            writes: [],
            executeCondition: {matchAll: true, reads: []},
            endCondition: {matchAll: true, reads: []}
          });
        }
        this.http_update_process(device.id, p, () => {
          this.alertService.operationDone();
          this.formService.closeForm();
        });
      }
    };
    this.formService.popupForm(fm);
  }

  getDeviceProcessName(deviceId: string, processId: string): { name: string } {
    const process = this.getOrCreateById(deviceId).description.processes.find(it => it.id == processId);
    return process ? process : {name: '---'};
  }
}
