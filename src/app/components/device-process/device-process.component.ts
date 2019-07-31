import {Component, Input, OnInit} from '@angular/core';
import {ProcessRuntime} from "../../core/model/tunnel.description";

@Component({
  selector: 'app-device-process',
  templateUrl: './device-process.component.html',
  styleUrls: ['./device-process.component.css']
})
export class DeviceProcessComponent implements OnInit {

  @Input()
  processRuntime: ProcessRuntime;

  constructor() {
  }

  ngOnInit() {
  }

}
