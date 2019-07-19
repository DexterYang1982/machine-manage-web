import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {MenuService} from "../../core/util/menu.service";
import {ModbusService} from "../../core/service/entity/modbus.service";

@Component({
  selector: 'app-modbus-write',
  templateUrl: './modbus-write.component.html',
  styleUrls: ['./modbus-write.component.css']
})
export class ModbusWriteComponent implements OnInit {

  @Input()
  menu:MenuItem[];
  @Input()
  modbusUnitId:string;
  @Input()
  writePointId:string;

  constructor(public modbusService:ModbusService,
              public menuService: MenuService) {
  }

  ngOnInit() {
  }

}
