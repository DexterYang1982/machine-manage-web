import {Component, Input, OnInit} from '@angular/core';
import {MenuService} from "../../core/util/menu.service";
import {MenuItem} from "primeng/api";
import {ModbusService} from "../../core/service/entity/modbus.service";

@Component({
  selector: 'app-modbus-read',
  templateUrl: './modbus-read.component.html',
  styleUrls: ['./modbus-read.component.css']
})
export class ModbusReadComponent implements OnInit {
  @Input()
  menu:MenuItem[];
  @Input()
  modbusUnitId:string;
  @Input()
  readPointId:string;

  constructor(public modbusService:ModbusService,
              public menuService: MenuService) {
  }
  ngOnInit() {
  }

}
