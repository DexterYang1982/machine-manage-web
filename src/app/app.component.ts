import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MenuService} from "./core/util/menu.service";
import {Menu} from "primeng/menu";
import {CustomFieldService} from "./core/service/entityField/custom-field.service";
import {EmbeddedFieldService} from "./core/service/entityField/embedded-field.service";
import {ModbusUnitClassService} from "./core/service/entityClass/modbus-unit-class.service";
import {MachineClassService} from "./core/service/entityClass/machine-class.service";
import {ModbusSlaveClassService} from "./core/service/entityClass/modbus-slave-class.service";
import {GroupClassService} from "./core/service/entityClass/group-class.service";
import {DisplayClassService} from "./core/service/entityClass/display-class.service";
import {CabinClassService} from "./core/service/entityClass/cabin-class.service";
import {DeviceClassService} from "./core/service/entityClass/device-class.service";
import {TunnelClassService} from "./core/service/entityClass/tunnel-class.service";
import {MachineService} from "./core/service/entity/machine.service";
import {ModbusSlaveService} from "./core/service/entity/modbus-slave.service";
import {ModbusUnitService} from "./core/service/entity/modbus-unit.service";
import {GroupService} from "./core/service/entity/group.service";
import {DeviceService} from "./core/service/entity/device.service";
import {DisplayService} from "./core/service/entity/display.service";
import {CabinService} from "./core/service/entity/cabin.service";
import {TunnelService} from "./core/service/entity/tunnel.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('menu', {static: false}) menu: Menu;

  constructor(public menuService: MenuService,
              public customFieldService: CustomFieldService,
              public embeddedFieldService: EmbeddedFieldService,
              public machineClassService: MachineClassService,
              public modbusSlaveClassService: ModbusSlaveClassService,
              public modbusUnitClassService: ModbusUnitClassService,
              public groupClassService: GroupClassService,
              public displayClassService: DisplayClassService,
              public cabinClassService: CabinClassService,
              public deviceClassService: DeviceClassService,
              public tunnelClassService: TunnelClassService,
              public machineService: MachineService,
              public modbusSlaveService: ModbusSlaveService,
              public modbusUnitService: ModbusUnitService,
              public groupService: GroupService,
              public deviceService: DeviceService,
              public displayService: DisplayService,
              public cabinService: CabinService,
              public tunnelService: TunnelService
  ) {
  }

  ngAfterViewInit() {
    this.menuService.menuControl = this.menu;
  }
}
