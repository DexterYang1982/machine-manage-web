import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormItem, FormItemType, FormModel, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService} from "./entity.service";
import {StructureData} from "../../model/structure-data.capsule";
import {TunnelClassService} from "../entityClass/tunnel-class.service";
import {TunnelDefinition, TunnelTransaction, TunnelTransactionPhase} from "../../model/tunnel.description";
import {CabinService} from "./cabin.service";
import {clone} from "../../util/utils";
import {DeviceService} from "./device.service";

@Injectable()
export class TunnelService extends EntityService<TunnelDefinition> {

  REQUEST_MAIN_CABIN_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateMainCabin'];
  REQUEST_TRANSACTION_ADD = ['POST', 'api/' + this.getDataName() + '/addTransaction'];
  REQUEST_TRANSACTION_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateTransaction'];
  REQUEST_TRANSACTION_DELETE = ['DELETE', 'api/' + this.getDataName() + '/deleteTransaction'];
  REQUEST_TRANSACTION_PHASE_ADD = ['POST', 'api/' + this.getDataName() + '/addTransactionPhase'];
  REQUEST_TRANSACTION_PHASE_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateTransactionPhase'];
  REQUEST_TRANSACTION_PHASE_DELETE = ['DELETE', 'api/' + this.getDataName() + '/deleteTransactionPhase'];

  http_update_main_cabin(id: string, mainCabinId: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_MAIN_CABIN_UPDATE,
      {
        id,
        mainCabinId
      }, null,
      callBack
    );
  }


  http_add_transaction(id: string, tunnelTransaction: TunnelTransaction, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_TRANSACTION_ADD,
      {
        id
      }, tunnelTransaction,
      callBack
    );
  }

  http_update_transaction(id: string, tunnelTransaction: TunnelTransaction, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_TRANSACTION_UPDATE,
      {
        id
      }, tunnelTransaction,
      callBack
    );
  }

  http_delete_transaction(id: string, transactionId: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_TRANSACTION_DELETE,
      {
        id,
        transactionId
      }, null,
      callBack
    );
  }


  http_add_transaction_phase(id: string, transactionId: string, phase: TunnelTransactionPhase, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_TRANSACTION_PHASE_ADD,
      {
        id,
        transactionId
      }, phase,
      callBack
    );
  }

  http_update_transaction_phase(id: string, transactionId: string, phase: TunnelTransactionPhase, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_TRANSACTION_PHASE_UPDATE,
      {
        id,
        transactionId
      }, phase,
      callBack
    );
  }

  http_delete_transaction_phase(id: string, transactionId: string, phaseId: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_TRANSACTION_PHASE_DELETE,
      {
        id,
        transactionId,
        phaseId
      }, null,
      callBack
    );
  }

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public tunnelClassService: TunnelClassService,
              public cabinService: CabinService,
              public deviceService: DeviceService) {
    super(websocketService, httpService, formService, alertService, tunnelClassService)
  }

  emptyDescription(): TunnelDefinition {
    return {
      mainCabinId: '',
      transactions: []
    };
  }

  getDataName(): string {
    return 'Tunnel'
  }

  getShowName(): string {
    return 'Tunnel'
  }

  getMenu(entity: StructureData<TunnelDefinition>, parentId: string) {
    const inherit = super.getMenu(entity, parentId);
    if (entity) {
      inherit.push({
        label: 'Edit Main Cabin',
        icon: 'ui-icon-edit',
        command: () => {
          this.editMainCabin(entity);
        }
      });
      inherit.push({
        label: 'Add Transaction',
        icon: 'ui-icon-add',
        command: () => {
          this.addOrEditTransactionName(entity, null);
        }
      });
    }
    return inherit
  }

  getTransactionMenu(entity: StructureData<TunnelDefinition>, transaction: TunnelTransaction) {
    return [
      {
        label: 'Edit Transaction',
        icon: 'ui-icon-edit',
        command: () => {
          this.addOrEditTransactionName(entity, transaction);
        }
      },
      {
        label: 'Delete Transaction',
        icon: 'ui-icon-delete',
        command: () => {
          this.deleteTransaction(entity, transaction);
        }
      },
      {
        label: 'Add Phase',
        icon: 'ui-icon-add',
        command: () => {
          this.addOrEditPhase(entity, transaction, null);
        }
      }
    ]
  }

  getTransactionPhaseMenu(entity: StructureData<TunnelDefinition>, transaction: TunnelTransaction, phase: TunnelTransactionPhase) {
    return [
      {
        label: 'Edit Phase',
        icon: 'ui-icon-edit',
        command: () => {
          this.addOrEditPhase(entity, transaction, phase);
        }
      },
      {
        label: 'Delete Phase',
        icon: 'ui-icon-delete',
        command: () => {
          this.deleteTransactionPhase(entity, transaction, phase);
        }
      }
    ]
  }

  deleteTransaction(entity: StructureData<TunnelDefinition>, transaction: TunnelTransaction) {
    this.alertService.needToConfirm('Delete Transaction',
      transaction.name,
      () => {
        this.http_delete_transaction(entity.id, transaction.id, () => {
          this.alertService.operationDone();
        });
      }
    );
  }

  deleteTransactionPhase(entity: StructureData<TunnelDefinition>, transaction: TunnelTransaction, phase: TunnelTransactionPhase) {
    this.alertService.needToConfirm('Delete Transaction Phase',
      '',
      () => {
        this.http_delete_transaction_phase(entity.id, transaction.id, phase.id, () => {
          this.alertService.operationDone();
        });
      }
    );
  }

  addOrEditPhase(tunnel: StructureData<TunnelDefinition>, transaction: TunnelTransaction, phase: TunnelTransactionPhase) {
    const deviceProcessSelect = {
      label: 'Device Process',
      name: 'deviceProcessId',
      type: FormItemType.SINGLE_SELECT,
      required: true,
      options: []
    };
    const fm: FormModel = {
      title: status ? 'Edit Device Process Phase' : 'Add Device Process Phase',
      action: status ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        id: phase ? phase.id : '',
        delay: phase ? phase.delay : 0,
        deviceId: phase ? phase.deviceId : null,
        deviceProcessId: phase ? phase.deviceProcessId : null,
        exportCabinId: phase ? phase.exportCabinId : null,
        importCabinId: phase ? phase.importCabinId : null,
      },
      formItems: [
        {
          label: 'Delay',
          name: 'delay',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Device',
          name: 'deviceId',
          type: FormItemType.SINGLE_SELECT,
          required: true,
          options: this.deviceService.getBySameGroup(tunnel).map(it => {
            return {
              label: it.name,
              value: it.id,
              data: it.description.processes.map(p => {
                return {
                  label: p.name,
                  value: p.id,
                }
              })
            }
          }),
          onValueChanged: (fi: FormItem) => {
            if (fm.data.deviceId) {
              const op = fi.options.find(it => it.value == fm.data.deviceId);
              deviceProcessSelect.options = op.data
            }
          }
        },
        deviceProcessSelect,
        {
          label: 'Export Cabin',
          name: 'exportCabinId',
          type: FormItemType.SINGLE_SELECT,
          options: this.cabinService.getBySameGroup(tunnel).map(it => {
            return {
              label: it.name,
              value: it.id
            }
          })
        }, {
          label: 'Import Cabin',
          name: 'importCabinId',
          type: FormItemType.SINGLE_SELECT,
          options: this.cabinService.getBySameGroup(tunnel).map(it => {
            return {
              label: it.name,
              value: it.id
            }
          })
        }
      ],
      okFunction: () => {
        if (phase) {
          this.http_update_transaction_phase(tunnel.id, transaction.id, fm.data, () => {
            this.alertService.operationDone();
            this.formService.closeForm();
          });
        } else {
          this.http_add_transaction_phase(tunnel.id, transaction.id, fm.data, () => {
            this.alertService.operationDone();
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }

  addOrEditTransactionName(tunnel: StructureData<TunnelDefinition>, transaction: TunnelTransaction) {
    const fm: FormModel = {
      title: transaction ? 'Edit Transaction' : 'Add Transaction',
      action: transaction ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        name: transaction ? transaction.name : '',
        targetCabinId: transaction ? transaction.targetCabinId : '',
      },
      formItems: [
        {
          label: 'Name',
          name: 'name',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Target Cabin',
          name: 'targetCabinId',
          type: FormItemType.SINGLE_SELECT,
          required: true,
          options: this.cabinService.getBySameGroup(tunnel).map(it => {
            return {
              label: it.name,
              value: it.id
            }
          })
        }
      ],
      okFunction: () => {
        if (transaction) {
          const t = clone(transaction);
          t.name = fm.data.name;
          t.targetCabinId = fm.data.targetCabinId;
          this.http_update_transaction(tunnel.id, t, () => {
            this.alertService.operationDone();
            this.formService.closeForm();
          });
        } else {
          const t = {
            id: '',
            name: fm.data.name,
            targetCabinId: fm.data.targetCabinId,
            phases: []
          };
          this.http_add_transaction(tunnel.id, t, () => {
            this.alertService.operationDone();
            this.formService.closeForm();
          });
        }
      }
    };
    this.formService.popupForm(fm);
  }

  editMainCabin(tunnel: StructureData<TunnelDefinition>) {
    const fm: FormModel = {
      title: 'Edit Main Cabin',
      action: 'Edit',
      windowWidth: 400,
      data: {
        mainCabinId: tunnel.description.mainCabinId
      },
      formItems: [
        {
          label: 'Main Cabin',
          name: 'mainCabinId',
          type: FormItemType.SINGLE_SELECT,
          required: true,
          options: this.cabinService.getBySameGroup(tunnel).map(it => {
            return {
              label: it.name,
              value: it.id
            }
          })
        }
      ],
      okFunction: () => {
        this.http_update_main_cabin(tunnel.id, fm.data.mainCabinId, () => {
          this.alertService.operationDone();
          this.formService.closeForm();
        });
      }
    };
    this.formService.popupForm(fm);
  }
}
