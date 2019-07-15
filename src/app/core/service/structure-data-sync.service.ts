import {Injectable} from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs';
import {ServerEntryService} from "../util/server-entry.service";
import {AlertService} from "../util/alert.service";
import {StructureDataCapsule} from "../model/structure-data.capsule";


@Injectable()
export class StructureDataSyncService {
  constructor(private serverEntryService: ServerEntryService,
              private alertService: AlertService) {
  }

  exchangePublisher = new Subject<StructureDataCapsule>();
  syncPublisher = new Subject<boolean>();
  websocket: WebSocket;

  closeCurrentAndConnect(): Observable<boolean> {
    if (this.websocket) {
      this.websocket.close();
    }
    return this.connect();
  }

  connect(): Observable<boolean> {
    return new Observable(
      (obs: Observer<boolean>) => {
        try {
          const serverEntry = this.serverEntryService.currentServerEntry;
          this.websocket = new WebSocket('ws://' + serverEntry.ip + ':'
            + serverEntry.port + '/management?nodeId=' + serverEntry.domainId + '&nodeSecret=' + serverEntry.domainSecret);
          this.websocket.onmessage = (message => {
            const exchangeModel = JSON.parse(message.data.toString()) as StructureDataCapsule;
            this.exchangePublisher.next(exchangeModel);
          });
          this.websocket.onerror = (e) => {
            this.alertService.alert('Disconnected with error');
            this.websocket.close();
            this.websocket = null;
            console.log(e);
          };
          this.websocket.onclose = (e) => {
            this.alertService.alert('Disconnected');
            this.websocket = null;
            console.log(e);
          };
          this.websocket.onopen = () => {
            console.log('websocket connected');
            this.syncPublisher.next(true);
            obs.next(true);
            obs.complete();
          };
        } catch (e) {
          this.alertService.alert(e.message);
          obs.next(false);
          obs.complete();
        }
      }
    );
  }
}

