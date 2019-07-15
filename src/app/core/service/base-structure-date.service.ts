import {StructureDataSyncService} from "./structure-data-sync.service";
import {filter} from "rxjs/operators";
import {StructureData, StructureDataCapsule, UpdateType} from "../model/structure-data.capsule";

export abstract class BaseStructureDateService<T> {
  data: StructureData<T>[] = [];
  parentMap = {};
  selectedId: string;

  setSelected(id: string): StructureData<T> {
    this.selectedId = id;
    return this.getById(id);
  }

  abstract emptyDescription(): T
  abstract fit(s: StructureDataCapsule): boolean

  createEmpty(id: string): StructureData<T> {
    return {
      id: id,
      name: '',
      alias: '',
      parentId: '',
      description: this.emptyDescription()
    }
  }

  entityUpdated(entity: StructureData<T>) {
    if (entity.parentId) {
      let brothers = this.parentMap[entity.parentId] as StructureData<T>[];
      if (brothers == null) {
        brothers = [];
        this.parentMap[entity.parentId] = brothers;
      }
      if (brothers.find(it => it.id == entity.id) == null) {
        brothers.push(entity)
      }
    }
  }

  entityDelete(entity: StructureData<T>) {
    if (entity.parentId) {
      const brothers = this.parentMap[entity.parentId] as StructureData<T>[];
      if (brothers != null) {
        this.parentMap[entity.parentId] = brothers.filter(it => it.id != entity.id)
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
          const update = JSON.parse(parcel.content) as T;
          const find = this.findAndUpdate(this.data, update);
          this.entityUpdated(find);
        } else if (parcel.updateType == UpdateType.delete) {
          this.data = this.data.filter(it => {
            if (it.id !== parcel.id) {
              return true;
            } else {
              it['deleted'] = true;
              this.entityDelete(it);
              return false;
            }
          });
        }
      }
    );
  }


  getById(id: string): StructureData<T> {
    if (id && id.length > 0) {
      let find = this.data.find(it => it.id === id);
      if (!find) {
        find = this.createEmpty(id);
        this.data.push(find);
      }
      return find;
    }
    return this.createEmpty('');
  }


  findAndUpdate(list: any[], newOne: any) {
    const oldOne = list.find(it => it['id'] && (it['id'] === newOne['id']));
    if (oldOne) {
      this.deepCopy(oldOne, newOne);
      return oldOne;
    } else {
      list.push(newOne);
      return newOne;
    }
  }

  deepCopy(oldOne: any, newOne: any) {
    for (const p in newOne) {
      if (newOne.hasOwnProperty(p)) {
        if (Array.isArray(newOne[p])) {
          const oldList = oldOne[p] as any[];
          const newList = (newOne[p] as any[]).map(it => this.findAndUpdate(oldList, it));
          oldList.filter(it => newList.indexOf(it) < 0).forEach(it => oldList.splice(oldList.indexOf(it), 1));
        } else if (typeof newOne[p] === 'object') {
          this.deepCopy(oldOne[p], newOne[p]);
        } else if (newOne[p] !== oldOne[p]) {
          oldOne[p] = newOne[p];
        }
      }
    }
  }
}