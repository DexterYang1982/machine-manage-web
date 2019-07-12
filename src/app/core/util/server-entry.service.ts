import {Injectable} from '@angular/core';
import {LocalStorage} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {AlertService} from './alert.service';
import {FormItemType, FormModel, FormService} from './form.service';
import {generateId} from './utils';
import {ServerEntry} from "./server-entry";


@Injectable()
export class ServerEntryService {

  @LocalStorage('MACHINE_CONFIG_SERVERS')
  servers: ServerEntry[];
  currentServerEntry: ServerEntry;

  constructor(private formService: FormService,
              private alertService: AlertService,
              private router: Router) {
  }

  enter(serverEntry: ServerEntry) {
    this.router.navigate(['/main', serverEntry.id]);
  }

  setCurrentServerEntry(entryId: string) {
    this.currentServerEntry = this.servers.find(serverEntry => {
      return serverEntry.id === entryId;
    });
  }

  deleteServerEntry(serverEntry: ServerEntry) {
    this.alertService.needToConfirm('Delete this server entry ', serverEntry.name, () => {
      this.servers = this.servers.filter(s => {
        return s.id !== serverEntry.id;
      });
    });
  }

  addOrEditServerEntry(serverEntry: ServerEntry) {
    const fm: FormModel = {
      title: serverEntry ? 'Edit Server Entry' : 'Add Server Entry',
      action: serverEntry ? 'Edit' : 'Add',
      windowWidth: 400,
      data: Object.assign({}, serverEntry ? serverEntry : {id: generateId()}),
      formItems: [
        {
          label: 'Name',
          name: 'name',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'IP',
          name: 'ip',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Port',
          name: 'port',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Domain Id',
          name: 'domainId',
          type: FormItemType.SINGLE_TEXT,
          required: true
        },
        {
          label: 'Domain Secret',
          name: 'domainSecret',
          type: FormItemType.PASSWORD,
          required: true
        }
      ],
      okFunction: () => {
        if (serverEntry) {
          this.servers = this.servers.map(s => {
            if (s.id === serverEntry.id) {
              return fm.data;
            } else {
              return s;
            }
          });
        } else {
          this.servers = [fm.data, ...(this.servers ? this.servers : [])];
        }
        this.formService.closeForm();
      }
    };
    this.formService.popupForm(fm);
  }
}
