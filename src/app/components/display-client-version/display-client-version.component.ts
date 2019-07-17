import {Component, Input, OnInit} from '@angular/core';
import {StructureData} from "../../core/model/structure-data.capsule";
import {MenuService} from "../../core/util/menu.service";
import {DisplayClientVersion} from "../../core/model/display-client-version.description";
import {DisplayClassService} from "../../core/service/entityClass/display-class.service";

@Component({
  selector: 'app-display-client-version',
  templateUrl: './display-client-version.component.html',
  styleUrls: ['./display-client-version.component.css']
})
export class DisplayClientVersionComponent implements OnInit {
  _displayClass: StructureData<DisplayClientVersion>;
  @Input()
  set displayClass(v: StructureData<any>) {
    this._displayClass = this.displayClassService.get(v.id)
  }

  constructor(public displayClassService: DisplayClassService,
              public menuService: MenuService) {
  }
  ngOnInit() {
  }
}
