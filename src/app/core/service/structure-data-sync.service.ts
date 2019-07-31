import {Injectable} from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs';
import {ServerEntryService} from "../util/server-entry.service";
import {AlertService} from "../util/alert.service";
import {StructureDataCapsule} from "../model/structure-data.capsule";


@Injectable()
export class StructureDataSyncService {
  syncFinished: boolean = false;
  exchangePublisher = new Subject<StructureDataCapsule>();
  syncPublisher = new Subject<boolean>();
  websocket: WebSocket;


  constructor(private serverEntryService: ServerEntryService,
              private alertService: AlertService) {
    this.syncPublisher.subscribe(sync => {
      this.syncFinished = sync;
    })
  }


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
            + serverEntry.port + '/machineStructureData?nodeId=' + serverEntry.domainId + '&nodeSecret=' + serverEntry.domainSecret);
          this.websocket.onmessage = (message => {
            const exchangeModel = JSON.parse(message.data.toString()) as StructureDataCapsule;
            if (exchangeModel.id == null) {
              this.syncPublisher.next(true);
            } else {
              this.exchangePublisher.next(exchangeModel);
            }
          });
          this.websocket.onerror = (e) => {
            this.alertService.alert('Structure Data Sync Service Disconnected with error');
            this.websocket.close();
            this.websocket = null;
            console.log(e);
          };
          this.websocket.onclose = (e) => {
            this.alertService.alert('Structure Data Sync Service Disconnected');
            this.websocket = null;
            console.log(e);
          };
          this.websocket.onopen = () => {
            console.log('Structure Data Sync Service Connected');
            this.syncPublisher.next(false);
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

