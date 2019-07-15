import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MenuService} from "./core/util/menu.service";
import {Menu} from "primeng/menu";
import {CustomFieldService} from "./core/service/entityField/custom-field.service";
import {EmbeddedFieldService} from "./core/service/entityField/embedded-field.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('menu', {static: false}) menu: Menu;

  constructor(private menuService: MenuService,
              private customFieldService: CustomFieldService,
              private embeddedFieldService: EmbeddedFieldService
  ) {
  }

  ngAfterViewInit() {
    this.menuService.menuControl = this.menu;
  }
}
