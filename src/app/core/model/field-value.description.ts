
export interface FieldValueDescription {
  output: boolean;
  valueDescriptions: ValueDescription[];
}

export interface ValueDescription {
  id: string;
  name: string;
  alias: string;
  valueExp: string;
  extra: string;
  color: string
}
