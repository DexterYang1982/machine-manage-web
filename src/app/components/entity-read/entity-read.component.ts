import {Component, Input, OnInit} from '@angular/core';
import {DeviceDefinition, EntityRead, READ_TARGET_TYPE} from "../../core/model/device.description";
import {EntityService, entityServiceMap} from "../../core/service/entity/entity.service";
import {ModbusService} from "../../core/service/entity/modbus.service";
import {CustomFieldService} from "../../core/service/entityField/custom-field.service";
import {ValueDescription} from "../../core/model/field-value.description";
import {MenuItem} from "primeng/api";
import {MenuService} from "../../core/util/menu.service";

@Component({
  selector: 'app-entity-read',
  templateUrl: './entity-read.component.html',
  styleUrls: ['./entity-read.component.css']
})
export class EntityReadComponent implements OnInit {
  @Input()
  menu: MenuItem[];
  @Input()
  entityRead: EntityRead;

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
    if (targetType == READ_TARGET_TYPE[0].value) {
      const status = (entity.description as DeviceDefinition).status.find(it => it.id == targetId);
      if (status) {
        result = this.modbusService.getReadPoint(status.modbusUnitId, status.readPointId)
      }

    } else {
      result = this.customFieldService.getByParentId(entity.nodeClassId).find(it => it.id == targetId);
    }
    return result;
  }

  getValueDescription(entityId: string, dataName: string, targetType: string, targetId: string, valueDescriptionId: string): { name: string } {
    const entity = (entityServiceMap[dataName] as EntityService<any>).getOrCreateById(entityId);
    let valueDescriptions: ValueDescription[] = [];
    if (targetType == READ_TARGET_TYPE[0].value) {
      const status = (entity.description as DeviceDefinition).status.find(it => it.id == targetId);
      if (status) {
        const readPoint = this.modbusService.getReadPoint(status.modbusUnitId, status.readPointId);
        if (readPoint) {
          valueDescriptions = this.modbusService.getRWPointValueDescription(status.modbusUnitId, readPoint.resultFieldId)
        }
      }

    } else {
      valueDescriptions = this.customFieldService.getByParentId(entity.nodeClassId).find(it => it.id == targetId).description.valueDescriptions;
    }
    const result = valueDescriptions.find(it => it.id == valueDescriptionId);
    return result ? result : {name: '---'}
  }

}
