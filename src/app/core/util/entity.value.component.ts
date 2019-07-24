import {StructureData} from "../model/structure-data.capsule";
import {RuntimeData, RuntimeDataSyncService} from "../service/runtime-data-sync.service";
import {EntityClassService, entityClassServiceMap} from "../service/entityClass/entity-class.service";
import {Input} from "@angular/core";

export abstract class EntityValueComponent {

  data: RuntimeData;
  _entity: StructureData<any>;
  @Input()
  set entity(v: StructureData<any>) {
    this._entity = v;
    this.data = this.getRuntimeData(v, this.getRestriction())
  }

  abstract getRestriction(): { dataName: string, fieldKey: string }[]

  getRuntimeData(entity: StructureData<any>, restrict: { dataName: string, fieldKey: string }[]) {
    const fit = restrict.find(it => it.dataName == entity.dataName);
    const entityClass = (entityClassServiceMap[entity.dataName+'Class'] as EntityClassService<any>).getOrCreateById(entity.nodeClassId);
    return fit ? this.runtimeDataSyncService.getOrCreateByNodeAndFieldKey(entity, entityClass, fit.fieldKey) : null
  }

  protected constructor(private runtimeDataSyncService: RuntimeDataSyncService) {
  }
}
