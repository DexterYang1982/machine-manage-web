import {Component, Input, OnInit} from '@angular/core';
import {StructureData} from "../../core/model/structure-data.capsule";
import {EmbeddedField, RuntimeData} from "../../core/service/runtime-data-sync.service";

@Component({
  selector: 'app-runtime-entity-field-value',
  templateUrl: './runtime-entity-field-value.component.html',
  styleUrls: ['./runtime-entity-field-value.component.css']
})
export class RuntimeEntityFieldValueComponent implements OnInit {
  embeddedField = EmbeddedField;
  @Input()
  showEntity: boolean;

  @Input()
  info: { entity: StructureData<any>, fieldName: string, fieldKey: string, runtimeData: RuntimeData<any> };

  constructor() {
  }

  ngOnInit() {
  }

  fit(restriction: { dataName: string, fieldName: string, fieldKey: string }[]): boolean {
    if (restriction[0].dataName == null && restriction[0].fieldKey == this.info.fieldKey) {
      //custom
      return true;
    }
    return restriction.find(it => this.info.entity.dataName == it.dataName && this.info.fieldKey == it.fieldKey) != null
  }

}
