export interface DeviceDefinition {
  status: ModbusRead[];
  commands: ModbusWrite[];
  processes: DeviceProcess[];
  errorCondition: ReadCondition;
}

export interface ModbusRead {
  id: string;
  modbusUnitId: string;
  readPointId: string;
}

export interface ModbusWrite {
  id: string;
  modbusUnitId: string;
  writePointId: string
}

export interface DeviceProcess {
  id: string;
  name: string;
  steps: DeviceProcessStep[];
}

export interface DeviceProcessStep {
  id: string;
  name: string;
  timeout: number;
  executeCondition: ReadCondition;
  execute: EntityWrite;
  endCondition: ReadCondition;
}

export interface EntityRead {
  id: string;
  entityId: string;
  dataName: string;
  targetType: string;
  targetId: string;
  valueDescriptionId: string;
}

export interface EntityWrite {
  id: string;
  entityId: string;
  dataName: string;
  targetType: string;
  targetId: string;
  valueDescriptionId: string;
}

export interface ReadCondition {
  matchAll: boolean;
  reads: EntityRead[];
}


export const READ_TARGET_TYPE = [
  {
    label: 'Device Status', value: 'DEVICE_STATUS'
  },
  {
    label: 'Entity Custom Output', value: 'CUSTOM_OUTPUT'
  }
];

export const WRITE_TARGET_TYPE = [
  {
    label: 'Device Command', value: 'DEVICE_COMMAND'
  },
  {
    label: 'Entity Custom Input', value: 'CUSTOM_INPUT'
  }
];
