import {Component, Input, OnInit} from '@angular/core';
import {EntityRead, ReadCondition} from "../../core/model/device.description";
import {StructureData} from "../../core/model/structure-data.capsule";
import {MenuService} from "../../core/util/menu.service";
import {FormItemType, FormModel, FormService} from "../../core/util/form.service";
import {clone} from "../../core/util/utils";
import {MenuItem} from "primeng/api";
import {AlertService} from "../../core/util/alert.service";
import {staticService} from "../../core/service/entity/entity.service";

@Component({
  selector: 'app-read-condition',
  templateUrl: './read-condition.component.html',
  styleUrls: ['./read-condition.component.css']
})
export class ReadConditionComponent implements OnInit {
  @Input()
  updateFunction: Function;

  @Input()
  name: string;

  @Input()
  entity: StructureData<any>;

  @Input()
  readCondition: ReadCondition;

  constructor(public menuService: MenuService,
              private alertService: AlertService,
              public formService: FormService) {
  }

  ngOnInit() {
  }

  getEntityReadMenu(entityRead: EntityRead): MenuItem[] {
    return [
      {
        label: 'Edit',
        icon: 'ui-icon-edit',
        command: () => {
          staticService.readWriteServiceInstance.addOrEditEntityRW(this.entity, entityRead, 'read', (er) => {
            const c = clone(this.readCondition);
            c.reads = c.reads.map(it => {
              if (it.id == er.id)
                return er;
              else
                return it;
            });
            if (this.updateFunction) {
              this.updateFunction(c)
            }
          });
        }
      },
      {
        label: 'Delete',
        icon: 'ui-icon-edit',
        command: () => {
          this.alertService.needToConfirm('Delete',
            'Condition',
            () => {
              const c = clone(this.readCondition);
              c.reads = c.reads.filter(it => it.id != entityRead.id);
              if (this.updateFunction) {
                this.updateFunction(c)
              }
            }
          );
        }
      }
    ]
  }

  editSatisfyMenu = [{
    label: 'Edit',
    icon: 'ui-icon-edit',
    command: () => {
      this.editSatisfaction();
    }
  }, {
    label: 'Add Condition',
    icon: 'ui-icon-add',
    command: () => {
      staticService.readWriteServiceInstance.addOrEditEntityRW(this.entity, null, 'read', (entityRead) => {
        const c = clone(this.readCondition);
        c.reads.push(entityRead);
        if (this.updateFunction) {
          this.updateFunction(c)
        }
      });
    }
  }];

  editSatisfaction() {
    const fm: FormModel = {
      title: 'Edit Satisfaction',
      action: 'Edit',
      windowWidth: 400,
      data: {
        satisfy: this.readCondition.matchAll,
      },
      formItems: [
        {
          label: 'Satisfy',
          name: 'satisfy',
          type: FormItemType.SINGLE_SELECT,
          required: true,
          options: [
            {value: true, label: 'All'},
            {value: false, label: 'Single'}
          ]
        }
      ],
      okFunction: () => {
        const c = clone(this.readCondition);
        c.matchAll = fm.data.satisfy;
        if (this.updateFunction) {
          this.updateFunction(c)
        }
        this.formService.closeForm();
      }
    };
    this.formService.popupForm(fm);
  }

}
