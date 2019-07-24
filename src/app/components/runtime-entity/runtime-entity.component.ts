import {Component, Input, OnInit} from '@angular/core';
import {StructureData} from "../../core/model/structure-data.capsule";
import {CustomFieldService} from "../../core/service/entityField/custom-field.service";
import {EmbeddedField, RuntimeData, RuntimeDataSyncService} from "../../core/service/runtime-data-sync.service";
import {FieldValueDescription} from "../../core/model/field-value.description";
import {DeviceDefinition} from "../../core/model/device.description";

@Component({
  selector: 'app-runtime-entity',
  templateUrl: './runtime-entity.component.html',
  styleUrls: ['./runtime-entity.component.css']
})
export class RuntimeEntityComponent implements OnInit {
  embeddedField = EmbeddedField;
  _entity: StructureData<any>;
  customFields: StructureData<FieldValueDescription>[];

  @Input()
  set entity(v: StructureData<any>) {
    this._entity = v;
    if (this._entity) {
      this.customFields = this.customFieldService.getByParentId(this._entity.nodeClassId)
    }
  }

  constructor(public customFieldService: CustomFieldService,
              public runtimeDataSyncService: RuntimeDataSyncService) {
  }

  ngOnInit() {
  }

  getCustomFieldInfo(customField: StructureData<any>): { entity: StructureData<any>, fieldName: string, fieldKey: string, runtimeData: RuntimeData<any> } {
    return {
      entity: this._entity,
      fieldName: customField.name,
      fieldKey: 'custom',
      runtimeData: this.runtimeDataSyncService.getOrCreateByNodeAndField(this._entity.id, customField.id)
    }
  }
}
