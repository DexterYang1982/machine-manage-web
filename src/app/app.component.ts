import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MenuService} from "./core/util/menu.service";
import {Menu} from "primeng/menu";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('menu',{static:false}) menu: Menu;

  constructor(private menuService: MenuService,
  ) {
  }

  ngAfterViewInit() {
    this.menuService.menuControl = this.menu;
  }
}
