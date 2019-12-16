import {Component, Input, OnInit} from '@angular/core';
import {ProcessRuntime, StepRuntime} from "../../core/model/tunnel.description";
import {DeviceService} from "../../core/service/entity/device.service";
import {StructureData} from "../../core/model/structure-data.capsule";
import {DeviceProcess} from "../../core/model/device.description";

@Component({
  selector: 'app-device-process',
  templateUrl: './device-process.component.html',
  styleUrls: ['./device-process.component.css']
})
export class DeviceProcessComponent implements OnInit {
  _processRuntime: ProcessRuntime;
  process: DeviceProcess;

  @Input()
  set processRuntime(v: ProcessRuntime) {
    if(v){
      this._processRuntime = v;
      const device = this.deviceService.getOrCreateById(v.deviceId);
      this.process = device.description?device.description.processes.find(it => it.id == v.deviceProcessId):null;
    }
  }

  constructor(private deviceService: DeviceService) {
  }

  stepName(stepId: string): string {
    const step = this.process.steps.find(it => it.id == stepId);
    return step ? step.name : ''
  }

  duration(step: StepRuntime): string {
    return (step.startTime != null && step.endTime != null) ? ((step.endTime - step.startTime) + '') : ''
  }

  ngOnInit() {
  }

}
