import {Injectable} from "@angular/core";
import {StructureDataSyncService} from "../structure-data-sync.service";
import {HttpService} from "../../util/http.service";
import {FormItemType, FormModel, FormService} from "../../util/form.service";
import {AlertService} from "../../util/alert.service";
import {EntityService} from "./entity.service";
import {StructureData} from "../../model/structure-data.capsule";
import {SlaveAddress} from "../../model/modbus-slave-address.descriptioin";
import {ModbusSlaveClassService} from "../entityClass/modbus-slave-class.service";
import {ModbusUnitService} from "./modbus-unit.service";

@Injectable()
export class ModbusSlaveService extends EntityService<SlaveAddress> {

  REQUEST_SLAVE_ADDRESS_UPDATE = ['PUT', 'api/' + this.getDataName() + '/updateSlaveAddress'];

  constructor(public websocketService: StructureDataSyncService,
              public httpService: HttpService,
              public formService: FormService,
              public alertService: AlertService,
              public modbusSlaveClassService: ModbusSlaveClassService,
              public modbusUnitService: ModbusUnitService) {
    super(websocketService, httpService, formService, alertService, modbusSlaveClassService)
  }

  emptyDescription(): SlaveAddress {
    return {
      ip: '',
      port: 0
    };
  }

  getDataName(): string {
    return 'ModbusSlave'
  }

  getShowName(): string {
    return 'Modbus Slave'
  }

  getMenu(entity: StructureData<SlaveAddress>, parentId: string) {
    const inherit = super.getMenu(entity, parentId);
    if (entity) {
      inherit.push({
        label: 'Edit Address',
        icon: 'ui-icon-edit',
        command: () => {
          this.editSlaveAddress(entity)
        }
      });
      inherit.push({
        label: 'Add Modbus Unit',
        icon: 'ui-icon-add',
        command: () => {
          this.modbusUnitService.addOrEdit(null, entity.id);
        }
      });
    }
    return inherit
  }

  http_slave_address_update(id: string, slaveAddress: SlaveAddress, callBack: () => void) {
    this.httpService.http<any>(
      this.REQUEST_SLAVE_ADDRESS_UPDATE,
      {
        id
      }, slaveAddress,
      callBack
    );
  }

  editSlaveAddress(entityClass: StructureData<SlaveAddress>) {
    const fm: FormModel = {
      title: 'Edit Slave Address',
      action: 'Edit',
      windowWidth: 400,
      data: Object.assign({}, entityClass.description),
      formItems: [
        {
          label: 'IP',
          name: 'ip',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Port',
          name: 'port',
          type: FormItemType.SINGLE_TEXT,
          required: true
        }
      ],
      okFunction: () => {
        this.http_slave_address_update(entityClass.id, fm.data, () => {
          this.formService.closeForm();
        });
      }
    };
    this.formService.popupForm(fm);
  }
}
