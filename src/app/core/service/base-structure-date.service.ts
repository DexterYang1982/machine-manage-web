import {StructureDataSyncService} from "./structure-data-sync.service";
import {filter} from "rxjs/operators";
import {StructureData, StructureDataCapsule, UpdateType} from "../model/structure-data.capsule";
import {findAndUpdate} from "../util/utils";

export abstract class BaseStructureDateService<T> {
  data: StructureData<T>[] = [];
  parentMap = {};

  abstract getDataName(): string

  abstract getShowName(): string

  abstract emptyDescription(): T

  abstract fit(s: StructureDataCapsule): boolean

  get(id: string): StructureData<T> {
    return this.data.find(it => it.id == id)
  }

  getByParentId(parentId: string): StructureData<T>[] {
    if (!this.parentMap[parentId]) {
      this.parentMap[parentId] = [];
    }
    return this.parentMap[parentId]
  }

  createEmpty(id: string): StructureData<T> {
    return {
      id: id,
      name: '',
      alias: '',
      parentId: null,
      nodeClassId: null,
      description: this.emptyDescription(),
      dataName: this.getDataName(),
      path: []
    }
  }

  entityUpdated(entity: StructureData<T>) {
    const parentId = entity.parentId ? entity.parentId : entity.nodeClassId;
    if (parentId) {
      let brothers = this.parentMap[parentId] as StructureData<T>[];
      if (brothers == null) {
        brothers = [];
        this.parentMap[parentId] = brothers;
      }
      if (brothers.find(it => it.id == entity.id) == null) {
        brothers.push(entity)
      }
    }
  }

  entityDelete(entity: StructureData<T>) {
    const parentId = entity.parentId ? entity.parentId : entity.nodeClassId;
    if (parentId) {
      const brothers = this.parentMap[parentId] as StructureData<T>[];
      if (brothers != null) {
        brothers.splice(brothers.indexOf(entity), 1);
      }
    }
  }

  protected constructor(public websocketService: StructureDataSyncService) {
    websocketService.syncPublisher.subscribe(_ => {
      this.data = [];
      this.parentMap = {};
    });
    websocketService.exchangePublisher.pipe(filter(it => {
      return this.fit(it)
    })).subscribe((parcel: StructureDataCapsule) => {
        if (parcel.updateType == UpdateType.update) {
          const update = JSON.parse(parcel.content) as StructureData<T>;
          update.dataName = parcel.dataName;
          const find = findAndUpdate(this.data, update);
          this.entityUpdated(find);
        } else if (parcel.updateType == UpdateType.delete) {
          const toDelete = this.getOrCreateById(parcel.id);
          const deleteIndex = this.data.indexOf(toDelete);
          this.data.splice(deleteIndex, 1);
          this.entityDelete(toDelete);
          toDelete['deleted'] = true
        }
      }
    );
  }


  getOrCreateById(id: string): StructureData<T> {
    if (id && id.length > 0) {
      let find = this.data.find(it => it.id === id);
      if (!find) {
        find = this.createEmpty(id);
        this.data.push(find);
      }
      return find;
    }
    return {
      id: id,
      name: '---',
      alias: '---',
      description: null,
      nodeClassId: null,
      parentId: null,
      path: [],
      dataName: this.getDataName()
    };
  }


}
