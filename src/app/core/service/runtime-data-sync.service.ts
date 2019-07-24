import {Injectable} from '@angular/core';
import {ServerEntryService} from "../util/server-entry.service";
import {AlertService} from "../util/alert.service";
import {findAndUpdate} from "../util/utils";


@Injectable()
export class RuntimeDataSyncService {
  constructor(private serverEntryService: ServerEntryService,
              private alertService: AlertService) {
  }

  data: RuntimeData[] = [];
  websocket: WebSocket;

  getOrCreateByNodeAndFieldKey(node: { id: string }, nodeClass: { id: string }, fieldKey: string): RuntimeData {
    return this.getOrCreateById(node.id + '^' + nodeClass.id + '^' + fieldKey)
  }

  getOrCreateByNodeAndField(node: { id: string }, field: { id: string }): RuntimeData {
    return this.getOrCreateById(node.id + '^' + field.id)
  }

  getOrCreateById(id: string): RuntimeData {
    let find = this.data.find(it => it.id === id);
    if (!find) {
      find = {
        id: id,
        nodeId: '',
        fieldId: '',
        fieldKey: '',
        value: '',
        session: '',
        updateTime: null
      };
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
        const runtimeData = JSON.parse(message.data.toString()) as RuntimeData;
        runtimeData.value = JSON.parse(runtimeData.value);
        console.log(runtimeData);
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
}

export interface RuntimeData {
  id: string;
  nodeId: string;
  fieldId: string;
  fieldKey: string;
  value: string;
  session: string;
  updateTime: number;
}
