import { Component, OnInit } from '@angular/core';
import {RuntimeExecuteService} from "../../core/service/runtime-execute.service";

@Component({
  selector: 'app-data-observer',
  templateUrl: './data-observer.component.html',
  styleUrls: ['./data-observer.component.css']
})
export class DataObserverComponent implements OnInit {

  constructor(public runtimeExecuteService:RuntimeExecuteService) { }

  ngOnInit() {
  }

}
