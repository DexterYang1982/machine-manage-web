export interface StructureDataCapsule {
  id: string;
  dataName: string;
  dataType: string;
  updateType: string;
  content: string;
  updateTime: number;
}

export interface StructureData<T> {
  id: string;
  name: string;
  alias: string;
  description: T;
  nodeClassId: string;
  parentId: string;
}


export const UpdateType = {
  update: 'update',
  delete: 'delete',
};

