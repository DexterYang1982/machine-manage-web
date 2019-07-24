import {Component, Input, OnInit} from '@angular/core';
import {StructureData} from "../../core/model/structure-data.capsule";
import {RuntimeData, RuntimeDataSyncService} from "../../core/service/runtime-data-sync.service";

@Component({
  selector: 'app-runtime-entity-field',
  templateUrl: './runtime-entity-field.component.html',
  styleUrls: ['./runtime-entity-field.component.css']
})
export class RuntimeEntityFieldComponent implements OnInit {
  info: { entity: StructureData<any>, fieldName: string, fieldKey: string, runtimeData: RuntimeData<any> };

  @Input()
  set entityFieldInfo(v: { entity: StructureData<any>, restriction: { dataName: string, fieldName: string, fieldKey: string }[] }) {
    const fit = v.restriction.find(it => it.dataName == v.entity.dataName);
    if (fit) {
      const runtimeData = this.runtimeDataSyncService.getOrCreateByNodeAndFieldKey(v.entity.id, v.entity.nodeClassId, fit.fieldKey);
      this.info = {
        entity: v.entity,
        fieldName: fit.fieldName,
        fieldKey: fit.fieldKey,
        runtimeData: runtimeData
      }
    }
  }
  constructor(private runtimeDataSyncService: RuntimeDataSyncService) {
  }
  ngOnInit() {
  }

}
