import { Component, OnInit } from '@angular/core';
import {ServerEntry} from "../../core/util/server-entry";
import {ServerEntryService} from "../../core/util/server-entry.service";
import {MenuService} from "../../core/util/menu.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(public serverEntryService: ServerEntryService,
              public menuService: MenuService) {
  }

  ngOnInit() {
    // test all availability
  }

  addServer() {
    this.serverEntryService.addOrEditServerEntry(null);
  }

  getMenu(serverEntry: ServerEntry) {
    return [
      {
        label: 'Enter',
        icon: 'ui-icon-forward',
        command: () => {
          this.serverEntryService.enter(serverEntry);
        }
      },
      {
        label: 'Edit',
        icon: 'ui-icon-edit',
        command: () => {
          this.serverEntryService.addOrEditServerEntry(serverEntry);
        }
      },
      {
        label: 'Delete',
        icon: 'ui-icon-delete',
        command: () => {
          this.serverEntryService.deleteServerEntry(serverEntry);
        }
      }
    ];
  }
}
