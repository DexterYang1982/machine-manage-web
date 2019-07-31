import {Component, Input, OnInit} from '@angular/core';
import {StructureData} from "../../core/model/structure-data.capsule";
import {ModbusService} from "../../core/service/entity/modbus.service";
import {AlertService} from "../../core/util/alert.service";
import {MenuService} from "../../core/util/menu.service";
import {RuntimeExecuteService} from "../../core/service/runtime-execute.service";
import {MenuItem} from "primeng/api";
import {generateId} from "../../core/util/utils";
import {TunnelDefinition, TunnelTransaction} from "../../core/model/tunnel.description";

@Component({
  selector: 'app-runtime-tunnel',
  templateUrl: './runtime-tunnel.component.html',
  styleUrls: ['./runtime-tunnel.component.css']
})
export class RuntimeTunnelComponent implements OnInit {


  @Input()
  tunnel: StructureData<TunnelDefinition>;


  constructor(private modbusService: ModbusService,
              private alertService: AlertService,
              private menuService: MenuService,
              private runtimeExecuteService: RuntimeExecuteService) {
  }

  ngOnInit() {

  }

  getTransactionMenu(transaction: TunnelTransaction): MenuItem[] {
    return [
      {
        label: 'Execute',
        command: () => {
          const session = generateId();
          this.runtimeExecuteService.showDataObserver(session);
          this.runtimeExecuteService.http_execute_tunnel_transaction(this.tunnel.id, transaction.id, session, () => {
          })
        }
      }
    ]
  }

}
