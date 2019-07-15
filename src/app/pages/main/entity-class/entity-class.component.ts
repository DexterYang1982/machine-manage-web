import {Component, OnInit} from '@angular/core';
import {FrameComponent} from "../frame/frame.component";
import {ActivatedRoute} from "@angular/router";
import {
  EntityClassService,
  entityClassServiceMap,
  selectedEntityClass,
} from "../../../core/service/entityClass/entity-class.service";

@Component({
  selector: 'app-entity-class',
  templateUrl: './entity-class.component.html',
  styleUrls: ['./entity-class.component.css']
})
export class EntityClassComponent implements OnInit {
  entityClassService: EntityClassService<any>;

  constructor(public framework: FrameComponent, public route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      const dataName = params.get('dataName');
      const selectedId = params.get('id');
      selectedEntityClass.dataName = dataName;
      selectedEntityClass.id = selectedId;
      this.entityClassService = entityClassServiceMap[dataName];
      if (this.entityClassService) {
        this.entityClassService.setSelected(selectedId)
      }
    });
  }

  ngOnInit() {
  }

}
