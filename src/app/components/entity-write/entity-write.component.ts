import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {DeviceDefinition, EntityWrite, WRITE_TARGET_TYPE} from "../../core/model/device.description";
import {ModbusService} from "../../core/service/entity/modbus.service";
import {MenuService} from "../../core/util/menu.service";
import {CustomFieldService} from "../../core/service/entityField/custom-field.service";
import {EntityService, entityServiceMap} from "../../core/service/entity/entity.service";
import {ValueDescription} from "../../core/model/field-value.description";

@Component({
  selector: 'app-entity-write',
  templateUrl: './entity-write.component.html',
  styleUrls: ['./entity-write.component.css']
})
export class EntityWriteComponent implements OnInit {

  @Input()
  menu: MenuItem[];
  @Input()
  entityWrite: EntityWrite;

  constructor(private modbusService: ModbusService,
              public menuService: MenuService,
              private customFieldService: CustomFieldService) {
  }

  ngOnInit() {
  }


  getEntity(entityId: string, dataName: string): { name: string } {
    const result = (entityServiceMap[dataName] as EntityService<any>).getOrCreateById(entityId);
    return result ? result : {name: '---'}
  }

  getTarget(entityId: string, dataName: string, targetType: string, targetId: string): { name: string } {
    const entity = (entityServiceMap[dataName] as EntityService<any>).getOrCreateById(entityId);
    let result = {name: '---'};
    if (targetType == WRITE_TARGET_TYPE[0].value) {
      const command = (entity.description as DeviceDefinition).commands.find(it => it.id == targetId);
      if (command) {
        result = this.modbusService.getWritePoint(command.modbusUnitId, command.writePointId)
      }

    } else {
      result = this.customFieldService.getByParentId(entity.nodeClassId).find(it => it.id == targetId);
    }
    return result;
  }

  getValueDescription(entityId: string, dataName: string, targetType: string, targetId: string, valueDescriptionId: string): { name: string } {
    const entity = (entityServiceMap[dataName] as EntityService<any>).getOrCreateById(entityId);
    let valueDescriptions: ValueDescription[] = [];
    if (targetType == WRITE_TARGET_TYPE[0].value) {
      const command = (entity.description as DeviceDefinition).commands.find(it => it.id == targetId);
      if (command) {
        const writePoint = this.modbusService.getWritePoint(command.modbusUnitId, command.writePointId);
        if (writePoint) {
          valueDescriptions = this.modbusService.getRWPointValueDescription(command.modbusUnitId, writePoint.commandFieldId)
        }
      }

    } else {
      valueDescriptions = this.customFieldService.getByParentId(entity.nodeClassId).find(it => it.id == targetId).description.valueDescriptions;
    }
    const result = valueDescriptions.find(it => it.id == valueDescriptionId);
    return result ? result : {name: '---'}
  }

}
