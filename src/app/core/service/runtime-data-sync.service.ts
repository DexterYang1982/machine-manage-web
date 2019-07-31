import {Injectable} from '@angular/core';
import {ServerEntryService} from "../util/server-entry.service";
import {AlertService} from "../util/alert.service";
import {clone, findAndUpdate} from "../util/utils";
import {Subject} from "rxjs";


@Injectable()
export class RuntimeDataSyncService {
  constructor(private serverEntryService: ServerEntryService,
              private alertService: AlertService) {
  }

  data: RuntimeData<any>[] = [];
  dataPublisher = new Subject<RuntimeData<any>>();
  websocket: WebSocket;

  getOrCreateByNodeAndFieldKey(entityId: string, nodeClassId: string, fieldKey: string): RuntimeData<any> {
    return this.getOrCreateById(entityId + '^' + nodeClassId + '^' + fieldKey)
  }

  getOrCreateByNodeAndField(entityId: string, fieldId: string): RuntimeData<any> {
    return this.getOrCreateById(entityId + '^' + fieldId)
  }

  getOrCreateById(id: string): RuntimeData<any> {
    let find = this.data.find(it => it.id === id);
    if (!find) {
      find = this.empty(id);
      this.data.push(find);
    }
    return find;
  }

  closeCurrentAndConnect(machineNodeId: string) {
    this.closeCurrent();
    this.connect(machineNodeId);
  }

  closeCurrent() {
    if (this.websocket) {
      this.websocket.close();
    }
    this.data = [];
  }

  connect(machineNodeId: string) {
    try {
      const serverEntry = this.serverEntryService.currentServerEntry;
      this.websocket = new WebSocket('ws://' + serverEntry.ip + ':'
        + serverEntry.port + '/machineRuntimeData?nodeId=' + serverEntry.domainId + '&nodeSecret=' + serverEntry.domainSecret + '&machineNodeId=' + machineNodeId);
      this.websocket.onmessage = (message => {
        const rawData = JSON.parse(message.data.toString()) as RuntimeData<string>;
        const runtimeData = this.empty('');
        Object.assign(runtimeData, rawData, {value: JSON.parse(rawData.value)});
        this.dataPublisher.next(clone(runtimeData));
        findAndUpdate(this.data, runtimeData);
      });
      this.websocket.onerror = (e) => {
        this.alertService.alert('Runtime Data Sync Service Disconnected with error');
        this.websocket.close();
        this.websocket = null;
        console.log(e);
      };
      this.websocket.onclose = (e) => {
        console.log('Runtime Data Sync Service Disconnected');
        this.websocket = null;
        console.log(e);
      };
      this.websocket.onopen = () => {
        console.log('Runtime Data Sync Service Connected');
      };
    } catch (e) {
      this.alertService.alert(e.message);
    }
  }

  empty(id: string): RuntimeData<any> {
    return {
      id: id,
      entityId: '',
      entityName: '',
      dataName: '',
      fieldId: '',
      fieldKey: '',
      fieldName: '',
      value: null,
      session: '',
      updateTime: null
    }
  }
}

export interface RuntimeData<T> {
  id: string;
  entityId: string;
  entityName: string;
  dataName: string;
  fieldId: string;
  fieldKey: string;
  fieldName: string;
  value: T;
  session: string;
  updateTime: number;
}

export const EmbeddedField = {
  connection: [{dataName: 'Machine', fieldName: 'Connection', fieldKey: 'RUNNING-STATUS'},
    {dataName: 'Display', fieldName: 'Connection', fieldKey: 'RUNNING-STATUS'},
    {dataName: 'ModbusSlave', fieldName: 'Connection', fieldKey: 'slave-connection'}],
  secret: [{dataName: 'Machine', fieldName: 'Connect Secret', fieldKey: 'SECRET'},
    {dataName: 'Display', fieldName: 'Connect Secret', fieldKey: 'SECRET'}],
  deviceHealthy: [{dataName: 'Device', fieldName: 'Healthy', fieldKey: 'device-healthy'}],
  deviceCurrentProcess: [{dataName: 'Device', fieldName: 'Current Process', fieldKey: 'current-process'}],
  deviceProcessQueue: [{dataName: 'Device', fieldName: 'Process Queue', fieldKey: 'process-queue'}],
  tunnelCurrentTransaction: [{dataName: 'Tunnel', fieldName: 'Current Transaction', fieldKey: 'current-transaction'}],
  cabinIsEmpty: [{dataName: 'Cabin', fieldName: 'Empty', fieldKey: 'cabin-is-empty'}],
  cabinStorage: [{dataName: 'Cabin', fieldName: 'Storage', fieldKey: 'cabin-storage'}],
  custom: [{dataName: null, fieldName: 'Custom Field', fieldKey: 'custom'}],
};
