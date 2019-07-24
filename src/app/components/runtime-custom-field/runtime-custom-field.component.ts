import {Component, Input, OnInit} from '@angular/core';
import {RuntimeDataSyncService} from "../../core/service/runtime-data-sync.service";
import {StructureData} from "../../core/model/structure-data.capsule";
import {FieldValueDescription} from "../../core/model/field-value.description";

@Component({
  selector: 'app-runtime-custom-field',
  templateUrl: './runtime-custom-field.component.html',
  styleUrls: ['./runtime-custom-field.component.css']
})
export class RuntimeCustomFieldComponent implements OnInit {

  @Input()
  entityAndField: { entity: StructureData<any>, field: StructureData<FieldValueDescription> };

  constructor(public runtimeDataSyncService: RuntimeDataSyncService) {
  }

  ngOnInit() {
  }

}
