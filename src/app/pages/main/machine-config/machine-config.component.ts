import {Component, OnInit} from '@angular/core';
import {FrameComponent} from "../frame/frame.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuService} from "../../../core/util/menu.service";
import {StructureData} from "../../../core/model/structure-data.capsule";
import {MachineService} from "../../../core/service/entity/machine.service";
import {ModbusSlaveService} from "../../../core/service/entity/modbus-slave.service";
import {ModbusUnitService} from "../../../core/service/entity/modbus-unit.service";
import {GroupService} from "../../../core/service/entity/group.service";
import {DisplayService} from "../../../core/service/entity/display.service";
import {CabinService} from "../../../core/service/entity/cabin.service";
import {DeviceService} from "../../../core/service/entity/device.service";
import {TunnelService} from "../../../core/service/entity/tunnel.service";
import {MachineDescription} from "../../../core/model/machine.description";

@Component({
  selector: 'app-machine-config',
  templateUrl: './machine-config.component.html',
  styleUrls: ['./machine-config.component.css']
})
export class MachineConfigComponent implements OnInit {
  machine: StructureData<MachineDescription>;

  constructor(public framework: FrameComponent,
              public route: ActivatedRoute,
              public router: Router,
              public menuService: MenuService,
              public machineService: MachineService,
              public modbusSlaveService: ModbusSlaveService,
              public modbusUnitService: ModbusUnitService,
              public groupService: GroupService,
              public displayService: DisplayService,
              public cabinService: CabinService,
              public deviceService: DeviceService,
              public tunnelService: TunnelService) {
    route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.machine = machineService.getOrCreateById(id);
    });
  }

  ngOnInit() {
  }

}
