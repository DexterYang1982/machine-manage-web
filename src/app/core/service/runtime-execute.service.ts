import {Injectable} from "@angular/core";
import {HttpService} from "../util/http.service";
import {RuntimeData, RuntimeDataSyncService} from "./runtime-data-sync.service";
import {Subscription} from "rxjs";
import {currentTime} from "../util/utils";
import {CustomFieldService} from "./entityField/custom-field.service";
import {FormItemType, FormModel, FormService} from "../util/form.service";

@Injectable()
export class RuntimeExecuteService {
  executionTime: number = 0;
  data: { entity: { id: string, name: string, dataName: string }, fieldName: string, fieldKey: string, runtimeData: RuntimeData<any> }[] = [];
  dataObserverVisible = false;

  subscription: Subscription;

  REQUEST_EXECUTE_DEVICE_COMMAND = ['POST', 'api/Runtime/executeDeviceCommand'];
  REQUEST_EXECUTE_DEVICE_PROCESS = ['POST', 'api/Runtime/executeDeviceProcess'];
  REQUEST_EXECUTE_TUNNEL_TRANSACTION = ['POST', 'api/Runtime/executeTunnelTransaction'];
  REQUEST_UPDATE_ENTITY_INPUT = ['POST', 'api/Runtime/updateEntityInput'];

  constructor(public httpService: HttpService,
              private customFieldService: CustomFieldService,
              private formService: FormService,
              private runtimeDataSyncService: RuntimeDataSyncService) {

  }

  closeDataObserver() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateEntityInput(entityId: string, inputFieldId: string) {
    const field = this.customFieldService.get(inputFieldId);
    const fieldValue = this.runtimeDataSyncService.getOrCreateByNodeAndField(entityId, inputFieldId).value;
    const fm: FormModel = {
      title: 'Update Input Field Value',
      action: 'Update',
      windowWidth: 400,
      data: {
        value: field.description.valueDescriptions.length > 0 ? fieldValue.valueExp : (fieldValue ? fieldValue.name : ''),
        session: '',
      },
      formItems: [
        {
          label: 'Value',
          name: 'value',
          type: field.description.valueDescriptions.length > 0 ? FormItemType.SINGLE_SELECT : FormItemType.SINGLE_TEXT,
          options: field.description.valueDescriptions.length > 0 ? field.description.valueDescriptions.map(it => {
            return {label: it.name, value: it.valueExp}
          }) : [],
          required: true
        },
        {
          label: 'Session',
          name: 'session',
          type: FormItemType.SINGLE_TEXT,
          required: false
        }
      ],
      okFunction: () => {
        this.http_update_entity_input(entityId, inputFieldId, fm.data.session, fm.data.value, () => {
          this.formService.closeForm();
        });
      }
    };
    this.formService.popupForm(fm);
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

  http_update_entity_input(entityId: string, inputFieldId: string, session: string, value: string, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_UPDATE_ENTITY_INPUT,
      {
        entityId,
        inputFieldId,
        session
      }, value,
      callBack
    );
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
