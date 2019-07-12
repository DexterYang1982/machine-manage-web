import {Injectable} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menu} from 'primeng/menu';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class MenuService {

  menuControl: Menu;

  constructor(private translateService: TranslateService) {
  }

  showMenu(menus: MenuItem[], event) {
    if (menus) {
      this.menuControl.model = menus.map(m => {
        return Object.assign({}, m, {
          label: this.translateService.instant(m.label),
        });
      });
      this.menuControl.toggle(event);
    }
  }
}
