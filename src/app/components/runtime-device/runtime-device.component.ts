import {Component, Input, OnInit} from '@angular/core';
import {StructureData} from "../../core/model/structure-data.capsule";
import {DeviceDefinition, DeviceProcess, ModbusRead, ModbusWrite} from "../../core/model/device.description";
import {RuntimeData, RuntimeDataSyncService} from "../../core/service/runtime-data-sync.service";
import {ModbusService} from "../../core/service/entity/modbus.service";
import {MenuItem} from "primeng/api";
import {RuntimeExecuteService} from "../../core/service/runtime-execute.service";
import {FieldValueDescription} from "../../core/model/field-value.description";
import {generateId} from "../../core/util/utils";
import {AlertService} from "../../core/util/alert.service";
import {MenuService} from "../../core/util/menu.service";

@Component({
  selector: 'app-runtime-device',
  templateUrl: './runtime-device.component.html',
  styleUrls: ['./runtime-device.component.css']
})
export class RuntimeDeviceComponent implements OnInit {

  @Input()
  device: StructureData<DeviceDefinition>;


  constructor(private modbusService: ModbusService,
              private alertService: AlertService,
              private menuService: MenuService,
              private runtimeExecuteService: RuntimeExecuteService,
              private runtimeDataSyncService: RuntimeDataSyncService) {
  }

  ngOnInit() {
  }

  getStatusInfo(status: ModbusRead): { entity: StructureData<any>, fieldName: string, fieldKey: string, runtimeData: RuntimeData<any> } {
    const resultField = this.modbusService.getReadPointField(status.modbusUnitId, status.readPointId);
    const modbusUnit = this.modbusService.getModbusUnit(status.modbusUnitId);
    return {
      entity: modbusUnit,
      fieldName: this.modbusService.getReadPointName(status.modbusUnitId, status.readPointId),
      fieldKey: 'custom',
      runtimeData: this.runtimeDataSyncService.getOrCreateByNodeAndField(modbusUnit.id, resultField.id)
    }
  }

  getProcessMenu(process: DeviceProcess): MenuItem[] {
    return [
      {
        label: 'Execute',
        command: () => {
          const session = generateId();
          this.runtimeExecuteService.showDataObserver(session);
          this.runtimeExecuteService.http_execute_device_process(this.device.id, process.id, session, () => {
          })
        }
      }
    ]
  }

  getCommandInfo(command: ModbusWrite): { entity: StructureData<any>, fieldName: string, fieldKey: string, runtimeData: RuntimeData<any>, menu: MenuItem[] } {
    const commandField = this.modbusService.getWritePointField(command.modbusUnitId, command.writePointId) as StructureData<FieldValueDescription>;
    const modbusUnit = this.modbusService.getModbusUnit(command.modbusUnitId);
    return {
      entity: modbusUnit,
      fieldName: this.modbusService.getWritePointName(command.modbusUnitId, command.writePointId),
      fieldKey: 'custom',
      runtimeData: this.runtimeDataSyncService.getOrCreateByNodeAndField(modbusUnit.id, commandField.id),
      menu: commandField.description.valueDescriptions.map(it => {
        return {
          label: it.name,
          command: () => {
            const session = generateId();
            this.runtimeExecuteService.showDataObserver(session);
            this.runtimeExecuteService.http_execute_device_command(this.device.id, command.id, it.id, session, () => {
            })
          }
        }
      })
    }
  }
}
