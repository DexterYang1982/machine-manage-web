import {EntityWrite, ReadCondition} from "./device.description";

export interface MachineDescription {
  triggers: Trigger[]
}

export interface Trigger {
  id: string;
  name: string;
  delay: number;
  condition: ReadCondition;
  writes:EntityWrite[];
}
