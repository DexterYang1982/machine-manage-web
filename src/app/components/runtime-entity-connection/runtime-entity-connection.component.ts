import {Component, OnInit} from '@angular/core';
import {RuntimeDataSyncService} from "../../core/service/runtime-data-sync.service";
import {EntityValueComponent} from "../../core/util/entity.value.component";

@Component({
  selector: 'app-runtime-entity-connection',
  templateUrl: './runtime-entity-connection.component.html',
  styleUrls: ['./runtime-entity-connection.component.css']
})
export class RuntimeEntityConnectionComponent extends EntityValueComponent implements OnInit {


  constructor(runtimeDataSyncService: RuntimeDataSyncService) {
    super(runtimeDataSyncService)
  }

  getRestriction(): { dataName: string; fieldKey: string }[] {
    return [
      {dataName: 'Machine', fieldKey: 'RUNNING-STATUS'},
      {dataName: 'Display', fieldKey: 'RUNNING-STATUS'},
      {dataName: 'ModbusSlave', fieldKey: 'slave-connection'}
    ];
  }

  ngOnInit() {
  }

}
