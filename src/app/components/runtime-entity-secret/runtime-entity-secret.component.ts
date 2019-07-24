import { Component, OnInit } from '@angular/core';
import {EntityValueComponent} from "../../core/util/entity.value.component";
import {RuntimeDataSyncService} from "../../core/service/runtime-data-sync.service";

@Component({
  selector: 'app-runtime-entity-secret',
  templateUrl: './runtime-entity-secret.component.html',
  styleUrls: ['./runtime-entity-secret.component.css']
})
export class RuntimeEntitySecretComponent extends EntityValueComponent implements OnInit {


  constructor(runtimeDataSyncService: RuntimeDataSyncService) {
    super(runtimeDataSyncService)
  }

  getRestriction(): { dataName: string; fieldKey: string }[] {
    return [
      {dataName: 'Machine', fieldKey: 'SECRET'},
      {dataName: 'Display', fieldKey: 'SECRET'}
    ];
  }

  ngOnInit() {
  }

}
