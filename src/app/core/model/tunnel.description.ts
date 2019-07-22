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
