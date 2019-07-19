import {Injectable} from "@angular/core";
import {MenuService} from "../../util/menu.service";
import {ModbusService} from "./modbus.service";
import {MachineService} from "./machine.service";
import {ModbusSlaveService} from "./modbus-slave.service";
import {ModbusUnitService} from "./modbus-unit.service";
import {GroupService} from "./group.service";
import {DeviceService} from "./device.service";
import {DisplayService} from "./display.service";
import {CabinService} from "./cabin.service";
import {TunnelService} from "./tunnel.service";
import {FormItemType, FormModel, FormService} from "../../util/form.service";
import {StructureData} from "../../model/structure-data.capsule";
import {DeviceDefinition, READ_TARGET_TYPE, WRITE_TARGET_TYPE} from "../../model/device.description";
import {generateId} from "../../util/utils";
import {CustomFieldService} from "../entityField/custom-field.service";

@Injectable()
export class ReadWriteService {
  constructor(private menuService: MenuService,
              private customFieldService: CustomFieldService,
              private modbusService: ModbusService,
              private machineService: MachineService,
              private modbusSlaveService: ModbusSlaveService,
              private modbusUnitService: ModbusUnitService,
              private groupService: GroupService,
              private deviceService: DeviceService,
              private displayService: DisplayService,
              private cabinService: CabinService,
              private tunnelService: TunnelService,
              private formService: FormService) {

  }

  addOrEditEntityRead(entity: StructureData<any>, erw: ERW, rw: string, commit: Function) {
    const targetType = rw == 'read' ? READ_TARGET_TYPE : WRITE_TARGET_TYPE;
    const valueDescriptionSelected = {
      label: 'Value',
      name: 'valueDescriptionId',
      type: FormItemType.SINGLE_SELECT,
      required: true,
      options: []
    };
    const targetSelect = {
      label: 'Target',
      name: 'targetId',
      type: FormItemType.SINGLE_SELECT,
      required: true,
      options: [],
      onValueChanged: (t) => {
        const op = t.options.find(it => it.value == fm.data.targetId);
        if (op) {
          valueDescriptionSelected.options = op.data
        }
      }
    };
    const entitySelect = {
      label: 'Entity',
      name: 'entityId',
      type: FormItemType.SINGLE_SELECT,
      required: true,
      options: [],
      onValueChanged: (t) => {
        const op = t.options.find(it => it.value == fm.data.entityId);
        if (op) {
          const et = op.data as StructureData<any>;
          fm.data.dataName = et.dataName;
          if (fm.data.targetType == targetType[0].value) {
            const device = et as StructureData<DeviceDefinition>;
            const points = rw == 'read' ?
              device.description.status.map(it => {
                const readPoint = this.modbusService.getReadPoint(it.modbusUnitId, it.readPointId);
                return {
                  modbusUnitId: it.modbusUnitId,
                  name: readPoint.name,
                  id: it.id,
                  resultFieldId: readPoint.resultFieldId
                }
              })
              : device.description.commands.map(it => {
                const writePoint = this.modbusService.getWritePoint(it.modbusUnitId, it.writePointId)
                return {
                  modbusUnitId: it.modbusUnitId,
                  name: writePoint.name,
                  id: it.id,
                  resultFieldId: writePoint.resultFieldId
                }
              });
            targetSelect.options = points.map(it => {
              return {
                label: it.name,
                value: it.id,
                data: this.modbusService.getRWPointValueDescription(it.modbusUnitId, it.resultFieldId).map(vd => {
                  return {
                    label: vd.name,
                    value: vd.id
                  }
                })
              };
            });
          } else {
            targetSelect.options = this.customFieldService.getByParentId(et.nodeClassId)
              .filter(it => {
                if (rw == 'read') {
                  return it.description.output
                } else {
                  return !it.description.output
                }
              })
              .map(it => {
                return {
                  label: it.name,
                  value: it.id,
                  data: it.description.valueDescriptions.map(vd => {
                    return {
                      label: vd.name,
                      value: vd.id
                    }
                  })
                };
              })
          }
        }
      }
    };
    const fm: FormModel = {
      title: erw ? 'Edit' : 'Add',
      action: erw ? 'Edit' : 'Add',
      windowWidth: 400,
      data: {
        id: erw ? erw.id : generateId(),
        targetType: erw ? erw.targetType : targetType[0].value,
        entityId: erw ? erw.entityId : null,
        dataName: erw ? erw.dataName : null,
        targetId: erw ? erw.targetId : null,
        valueDescriptionId: erw ? erw.valueDescriptionId : null,
      },
      formItems: [
        {
          label: 'Target Type',
          name: 'targetType',
          type: FormItemType.SINGLE_SELECT,
          required: true,
          options: targetType,
          onValueChanged: () => {
            if (fm.data.targetType == targetType[0].value) {
              entitySelect.options = this.getAllDeviceOption(entity)
            } else if (fm.data.targetType == targetType[1].value) {
              entitySelect.options = this.getAllEntitiesOption(entity);
            }
          }
        }
        ,
        entitySelect,
        targetSelect,
        valueDescriptionSelected
      ],
      okFunction: () => {
        commit(fm.data);
        this.formService.closeForm();
      }
    };
    this.formService.popupForm(fm);
  }


  private getAllDeviceOption(entity: StructureData<any>) {
    return this.deviceService.getBySameMachine(entity).map(it => {
      return {
        value: it.id,
        label: it.name,
        data: it
      }
    })
  }

  private getAllEntitiesOption(entity: StructureData<any>) {
    const entities = [];
    this.machineService.getBySameMachine(entity).forEach(machine => {
        entities.push({
          value: machine.id,
          label: '' + machine.name,
          data: machine
        });
        this.modbusSlaveService.getByParentId(machine.id).forEach(modbusSlave => {
            entities.push({
              value: modbusSlave.id,
              label: '--' + modbusSlave.name,
              data: modbusSlave
            });
            this.modbusUnitService.getByParentId(modbusSlave.id).forEach(modbusUnit => {
                entities.push({
                  value: modbusUnit.id,
                  label: '----' + modbusUnit.name,
                  data: modbusUnit
                });
              }
            )
          }
        );
        this.groupService.getByParentId(machine.id).forEach(group => {
            entities.push({
              value: group.id,
              label: '--' + group.name,
              data: group
            });
            this.displayService.getByParentId(group.id).forEach(display => {
                entities.push({
                  value: display.id,
                  label: '----' + display.name,
                  data: display
                });
              }
            );
            this.displayService.getByParentId(group.id).forEach(display => {
                entities.push({
                  value: display.id,
                  label: '----' + display.name,
                  data: display
                });
              }
            );
            this.cabinService.getByParentId(group.id).forEach(cabin => {
                entities.push({
                  value: cabin.id,
                  label: '----' + cabin.name,
                  data: cabin
                });
              }
            );

            this.deviceService.getByParentId(group.id).forEach(device => {
                entities.push({
                  value: device.id,
                  label: '----' + device.name,
                  data: device
                });
              }
            );
            this.tunnelService.getByParentId(group.id).forEach(tunnel => {
                entities.push({
                  value: tunnel.id,
                  label: '----' + tunnel.name,
                  data: tunnel
                });
              }
            );
          }
        )
      }
    );
    return entities;
  }
}

interface ERW {
  id: string;
  entityId: string;
  dataName: string;
  targetType: string;
  targetId: string;
  valueDescriptionId: string;
}
