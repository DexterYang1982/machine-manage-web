
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
