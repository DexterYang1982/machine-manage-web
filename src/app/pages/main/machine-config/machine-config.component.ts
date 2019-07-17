import {Component, OnInit} from '@angular/core';
import {FrameComponent} from "../frame/frame.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuService} from "../../../core/util/menu.service";
import {StructureData} from "../../../core/model/structure-data.capsule";
import {MachineService} from "../../../core/service/entity/machine.service";
import {ModbusSlaveService} from "../../../core/service/entity/modbus-slave.service";
import {ModbusUnitService} from "../../../core/service/entity/modbus-unit.service";

@Component({
  selector: 'app-machine-config',
  templateUrl: './machine-config.component.html',
  styleUrls: ['./machine-config.component.css']
})
export class MachineConfigComponent implements OnInit {
  machine: StructureData<string>;

  constructor(public framework: FrameComponent,
              public route: ActivatedRoute,
              public router: Router,
              public machineService: MachineService,
              public modbusSlaveService: ModbusSlaveService,
              public modbusUnitService: ModbusUnitService,
              public menuService: MenuService) {
    route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.machine = machineService.getOrCreateById(id);
    });
  }

  ngOnInit() {
  }

}
