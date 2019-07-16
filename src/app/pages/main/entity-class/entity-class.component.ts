import {Component, OnInit} from '@angular/core';
import {FrameComponent} from "../frame/frame.component";
import {ActivatedRoute, Router} from "@angular/router";
import {
  EntityClassService,
  entityClassServiceMap,
  selectedEntityClass
} from "../../../core/service/entityClass/entity-class.service";
import {MenuService} from "../../../core/util/menu.service";
import {CustomFieldService} from "../../../core/service/entityField/custom-field.service";

@Component({
  selector: 'app-entity-class',
  templateUrl: './entity-class.component.html',
  styleUrls: ['./entity-class.component.css']
})
export class EntityClassComponent implements OnInit {
  entityClassService: EntityClassService<any>;

  constructor(public framework: FrameComponent,
              public route: ActivatedRoute,
              public router: Router,
              public customFieldService: CustomFieldService,
              public menuService: MenuService) {
    route.paramMap.subscribe(params => {
      const dataName = params.get('dataName');
      selectedEntityClass.selectedDataName = dataName;
      this.entityClassService = entityClassServiceMap[dataName];
    });
  }

  ngOnInit() {
  }

}
