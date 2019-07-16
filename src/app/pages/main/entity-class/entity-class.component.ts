import {Component, OnInit} from '@angular/core';
import {FrameComponent} from "../frame/frame.component";
import {ActivatedRoute, Router} from "@angular/router";
import {
  EntityClassService,
  entityClassServiceMap,
  selectedEntityClass,
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
  selected = selectedEntityClass;

  constructor(public framework: FrameComponent,
              public route: ActivatedRoute,
              public router: Router,
              public customFieldService: CustomFieldService,
              public menuService: MenuService) {
    route.paramMap.subscribe(params => {
      const dataName = params.get('dataName');
      const selectedId = params.get('id');
      this.selected.dataName = dataName;
      this.selected.id = selectedId;
      this.entityClassService = entityClassServiceMap[dataName];
      this.selected.data = this.entityClassService ? this.entityClassService.getById(selectedId) : null;
    });
  }

  detail(entityId: string) {
    this.router.navigate(['entityClass/' + this.selected.dataName + "/" + entityId], {relativeTo: this.route.parent});
  }

  ngOnInit() {
  }

}
