export interface TunnelDefinition {
  mainCabinId: string;
  transactions: TunnelTransaction[]
}

export interface TunnelTransaction {
  id: string;
  name: string;
  targetCabinId: string;
  phases: TunnelTransactionPhase[];
}

export interface TunnelTransactionPhase {
  id: string;
  delay: number;
  deviceId: string;
  deviceProcessId: string;
  exportCabinId: string;
  importCabinId: string;
}

export interface CurrentTransaction {
  transactionId: string;
  transactionSession: string;
  finishedExportation: boolean;
  transactionProcesses: ProcessRuntime[]
}

export interface ProcessRuntime {
  transactionId: string;
  transactionPhaseId: string;
  transactionSession: string;
  transactionPhaseSession: string;
  tunnelId: string;
  deviceId: string;
  deviceProcessId: string;
  stepRuntime: StepRuntime[];
  initTime: number;
  delay: number;
  state: string;
}

export interface StepRuntime {
  stepId: string;
  state: string;
  startTime: number;
  endTime: number;
}
