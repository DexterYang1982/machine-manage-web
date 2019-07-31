import {Component, Input, OnInit} from '@angular/core';
import {CurrentTransaction} from "../../core/model/tunnel.description";

@Component({
  selector: 'app-tunnel-transaction',
  templateUrl: './tunnel-transaction.component.html',
  styleUrls: ['./tunnel-transaction.component.css']
})
export class TunnelTransactionComponent implements OnInit {

  @Input()
  currentTransaction: CurrentTransaction;

  constructor() {
  }

  ngOnInit() {
  }

}
