import {Injectable} from "@angular/core";
import {HttpService} from "../util/http.service";
import {RuntimeData, RuntimeDataSyncService} from "./runtime-data-sync.service";
import {Subscription} from "rxjs";
import {currentTime} from "../util/utils";

@Injectable()
export class RuntimeExecuteService {
  executionTime: number = 0;
  data: { entity: { id: string, name: string, dataName: string }, fieldName: string, fieldKey: string, runtimeData: RuntimeData<any> }[] = [];
  dataObserverVisible = false;

  subscription: Subscription;

  REQUEST_EXECUTE_DEVICE_COMMAND = ['POST', 'api/Runtime/executeDeviceCommand'];
  REQUEST_EXECUTE_DEVICE_PROCESS = ['POST', 'api/Runtime/executeDeviceProcess'];
  REQUEST_EXECUTE_TUNNEL_TRANSACTION = ['POST', 'api/Runtime/executeTunnelTransaction'];

  constructor(public httpService: HttpService,
              private runtimeDataSyncService: RuntimeDataSyncService) {

  }

  closeDataObserver() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showDataObserver(session: string) {
    this.executionTime = currentTime();
    this.data = [];
    this.subscription = this.runtimeDataSyncService.dataPublisher.subscribe(runtimeData => {
      if (runtimeData.session.startsWith(session)) {
        this.data = [{
          entity: {
            id: runtimeData.entityId,
            name: runtimeData.entityName,
            dataName: runtimeData.dataName
          },
          fieldKey: runtimeData.fieldKey,
          fieldName: runtimeData.fieldName,
          runtimeData: runtimeData
        }, ...this.data]
      }
    });
    this.dataObserverVisible = true;
  }

  http_execute_device_process(deviceId: string, processId: string, session: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_EXECUTE_DEVICE_PROCESS,
      {
        deviceId,
        processId,
        session
      }, null,
      callBack
    );
  }

  http_execute_device_command(deviceId: string, commandId: string, valueDescriptionId: string, session: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_EXECUTE_DEVICE_COMMAND,
      {
        deviceId,
        commandId,
        valueDescriptionId,
        session
      }, null,
      callBack
    );
  }
  http_execute_tunnel_transaction(tunnelId: string, transactionId: string, session: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_EXECUTE_TUNNEL_TRANSACTION,
      {
        tunnelId,
        transactionId,
        session
      }, null,
      callBack
    );
  }


}
