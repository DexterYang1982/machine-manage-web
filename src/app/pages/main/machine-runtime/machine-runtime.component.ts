import {Component, OnDestroy, OnInit} from '@angular/core';
import {FrameComponent} from "../frame/frame.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuService} from "../../../core/util/menu.service";
import {MachineService} from "../../../core/service/entity/machine.service";
import {ModbusSlaveService} from "../../../core/service/entity/modbus-slave.service";
import {ModbusUnitService} from "../../../core/service/entity/modbus-unit.service";
import {GroupService} from "../../../core/service/entity/group.service";
import {DisplayService} from "../../../core/service/entity/display.service";
import {CabinService} from "../../../core/service/entity/cabin.service";
import {DeviceService} from "../../../core/service/entity/device.service";
import {TunnelService} from "../../../core/service/entity/tunnel.service";
import {StructureData} from "../../../core/model/structure-data.capsule";
import {MachineDescription} from "../../../core/model/machine.description";
import {RuntimeDataSyncService} from "../../../core/service/runtime-data-sync.service";
import {TreeNode} from "primeng/api";

@Component({
  selector: 'app-machine-runtime',
  templateUrl: './machine-runtime.component.html',
  styleUrls: ['./machine-runtime.component.css']
})
export class MachineRuntimeComponent implements OnInit, OnDestroy {
  machine: StructureData<MachineDescription>;
  data: TreeNode[];

  constructor(public framework: FrameComponent,
              public route: ActivatedRoute,
              public router: Router,
              public menuService: MenuService,
              public machineService: MachineService,
              public runtimeDataSyncService: RuntimeDataSyncService,
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
      if (this.machine) {
        this.runtimeDataSyncService.closeCurrentAndConnect(id);
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.runtimeDataSyncService.closeCurrent();
  }

}
