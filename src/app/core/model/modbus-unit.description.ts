
export interface ModbusUnitDescription {
  read: ReadPoint[];
  write: WritePoint[]
}

export interface ReadPoint {
  id: string;
  name: string;
  point: Point;
  resultFieldId: string;
  sessionFollowWritePoints: string[]
}

export interface WritePoint {
  id: string;
  name: string;
  point: Point;
  expired: number;
  commandFieldId: string;
  resultFieldId: string;
  commandType: string;
}

export interface Point {
  position: number;
  quantity: number;
  memoryType: string;
}




export const WRITE_MEMORY_TYPE = [
  {
    label: 'Holding Register', value: 'HOLDING_REGISTER'
  },
  {
    label: 'Coil ClientStatus', value: 'COIL_STATUS'
  }
];
export const READ_MEMORY_TYPE = [
  {
    label: 'Holding Register', value: 'HOLDING_REGISTER'
  },
  {
    label: 'Coil ClientStatus', value: 'COIL_STATUS'
  },
  {
    label: 'Input ClientStatus', value: 'INPUT_STATUS'
  },
  {
    label: 'Input Register', value: 'INPUT_REGISTER'
  }
];
export const COMMAND_TYPE = [
  {
    label: 'Instant', value: 'INSTANT'
  },
  {
    label: 'Persistent', value: 'PERSISTENT'
  }
];
