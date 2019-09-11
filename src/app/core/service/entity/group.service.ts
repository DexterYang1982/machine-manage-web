import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormItemType, FormModel, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService, staticService} from "./entity.service";
import {StructureData} from "../../model/structure-data.capsule";
import {GroupClassService} from "../entityClass/group-class.service";
import {DisplayService} from "./display.service";
import {CabinService} from "./cabin.service";
import {DeviceService} from "./device.service";
import {TunnelService} from "./tunnel.service";
import {GroupDescription} from "../../model/group.description";
import {Trigger} from "../../model/machine.description";
import {EntityWrite, ReadCondition} from "../../model/device.description";
import {clone} from "../../util/utils";

@Injectable()
export class GroupService extends EntityService<GroupDescription> {

  REQUEST_TRIGGER_ADD = ['POST', 'api/' + this.getDataName() + '/addTrigger'];
  REQUEST_TRIGGER_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateTrigger'];
  REQUEST_TRIGGER_DELETE = ['DELETE', 'api/' + this.getDataName() + '/deleteTrigger'];

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public groupClassService: GroupClassService,
              public displayService: DisplayService,
              public cabinService: CabinService,
              public deviceService: DeviceService,
              public tunnelService: TunnelService) {
    super(websocketService, httpService, formService, alertService, groupClassService)
  }

  emptyDescription(): GroupDescription {
    return {
      triggers: []
    };
  }

  getDataName(): string {
    return 'Group'
  }

  getShowName(): string {
    return 'Group'
  }

  getMenu(entity: StructureData<GroupDescription>, parentId: string) {
    const inherit = super.getMenu(entity, parentId);
    if (entity) {
      inherit.push({
        label: 'Add Display',
        icon: 'ui-icon-add',
        command: () => {
          this.displayService.addOrEdit(null, entity.id);
        }
      });
      inherit.push({
        label: 'Add Cabin',
        icon: 'ui-icon-add',
        command: () => {
          this.cabinService.addOrEdit(null, entity.id);
        }
      });
      inherit.push({
        label: 'Add Device',
        icon: 'ui-icon-add',
        command: () => {
          this.deviceService.addOrEdit(null, entity.id);
        }
      });
      inherit.push({
        label: 'Add Tunnel',
        icon: 'ui-icon-add',
        command: () => {
          this.tunnelService.addOrEdit(null, entity.id);
        }
      });
      inherit.push({
        label: 'Add Trigger',
        icon: 'ui-icon-add',
        command: () => {
          this.addOrEditTriggerName(entity, null)
        }
      });
    }
    return inherit
  }

  getTriggerMenu(group: StructureData<GroupDescription>, trigger: Trigger) {
    return [{
      label: 'Edit',
      icon: 'ui-icon-edit',
      command: () => {
        this.addOrEditTriggerName(group, trigger);
      }
    }, {
      label: 'Add Write',
      icon: 'ui-icon-add',
      command: () => {
        staticService.readWriteServiceInstance.addOrEditEntityRW(group, null, 'write', (write_edit: EntityWrite) => {
          const trigger_edit = clone(trigger);
          trigger_edit.writes.push(write_edit);
          this.http_update_trigger(group.id, trigger_edit, () => {
            this.alertService.operationDone();
          });
        })
      }
    }, {
      label: 'Delete',
      icon: 'ui-icon-delete',
      command: () => {
        this.deleteTrigger(group, trigger);
      }
    }];
  }

  getTriggerWriteMenu(group: StructureData<GroupDescription>, trigger: Trigger, write: EntityWrite) {
    return [{
      label: 'Edit',
      icon: 'ui-icon-edit',
      command: () => {
        staticService.readWriteServiceInstance.addOrEditEntityRW(group, write, 'write', (write_edit: EntityWrite) => {
          const trigger_edit = clone(trigger);
          trigger_edit.writes = trigger_edit.writes.map(w => {
            if (w.id == write_edit.id)
              return write_edit;
            else
              return w;
          });
          this.http_update_trigger(group.id, trigger_edit, () => {
            this.alertService.operationDone();
          });
        })
      }
    }, {
      label: 'Delete',
      icon: 'ui-icon-delete',
      command: () => {
        const trigger_edit = clone(trigger);
        trigger_edit.writes = trigger_edit.writes.filter(w => w.id != write.id);
        this.http_update_trigger(group.id, trigger_edit, () => {
          this.alertService.operationDone();
        });
      }
    }];
  }

  http_add_trigger(id: string, trigger: Trigger, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_TRIGGER_ADD,
      {
        id
      }, trigger,
      callBack
    );
  }

  http_update_trigger(id: string, trigger: Trigger, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_TRIGGER_UPDATE,
      {
        id
      }, trigger,
      callBack
    );
  }

  http_delete_trigger(id: string, triggerId: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_TRIGGER_DELETE,
      {
        id,
        triggerId
      }, null,
      callBack
    );
  }

  addOrEditTriggerName(group: StructureData<GroupDescription>, trigger: Trigger) {
    const fm: FormModel = {
      title: status ? 'Edit Trigger' : 'Add Trigger',
      action: status ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        id: trigger ? trigger.id : '',
        name: trigger ? trigger.name : '',
        delay: trigger ? trigger.delay : 1000,
        timeout: trigger ? trigger.timeout : 5000
      },
      formItems: [
        {
          label: 'Name',
          name: 'name',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Delay',
          name: 'delay',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Timeout',
          name: 'timeout',
          type: FormItemType.SINGLE_TEXT,
          required: true
        }
      ],
      okFunction: () => {
        if (trigger) {
          const updateTrigger: Trigger = {
            id: trigger.id,
            name: fm.data['name'],
            delay: fm.data['delay'],
            timeout: fm.data['timeout'],
            condition: trigger.condition,
            writes: trigger.writes
          };
          this.http_update_trigger(group.id, updateTrigger, () => {
            this.alertService.operationDone();
            this.formService.closeForm();
          });
        } else {
          const newTrigger: Trigger = {
            id: '',
            name: fm.data['name'],
            delay: fm.data['delay'],
            timeout: fm.data['timeout'],
            condition: {matchAll: true, reads: []},
            writes: []
          };
          this.http_add_trigger(group.id, newTrigger, () => {
            this.alertService.operationDone();
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }

  deleteTrigger(group: StructureData<GroupDescription>, trigger: Trigger) {
    this.alertService.needToConfirm('Delete Process',
      trigger.name,
      () => {
        this.http_delete_trigger(group.id, trigger.id, () => {
          this.alertService.operationDone();
        });
      }
    );
  }


  triggerConditionUpdate(group: StructureData<GroupDescription>, trigger: Trigger) {
    return (readCondition: ReadCondition) => {
      const t = clone(trigger);
      t.condition = readCondition
      this.http_update_trigger(group.id, t, () => {
        this.alertService.operationDone();
      });
    }
  }
}
