import {Component, Input, OnInit} from '@angular/core';
import {StructureData} from "../../core/model/structure-data.capsule";
import {DeviceDefinition, ModbusRead, ModbusWrite} from "../../core/model/device.description";
import {RuntimeData, RuntimeDataSyncService} from "../../core/service/runtime-data-sync.service";
import {ModbusService} from "../../core/service/entity/modbus.service";

@Component({
  selector: 'app-runtime-device',
  templateUrl: './runtime-device.component.html',
  styleUrls: ['./runtime-device.component.css']
})
export class RuntimeDeviceComponent implements OnInit {

  @Input()
  device: StructureData<DeviceDefinition>;


  constructor(private modbusService: ModbusService,
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


  getCommandInfo(command: ModbusWrite): { entity: StructureData<any>, fieldName: string, fieldKey: string, runtimeData: RuntimeData<any> } {
    const commandField = this.modbusService.getWritePointField(command.modbusUnitId, command.writePointId);
    const modbusUnit = this.modbusService.getModbusUnit(command.modbusUnitId);
    return {
      entity: modbusUnit,
      fieldName: this.modbusService.getWritePointName(command.modbusUnitId, command.writePointId),
      fieldKey: 'custom',
      runtimeData: this.runtimeDataSyncService.getOrCreateByNodeAndField(modbusUnit.id, commandField.id)
    }
  }
}
