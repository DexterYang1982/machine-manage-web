import {Component, Input, OnInit} from '@angular/core';
import {ReadCondition} from "../../core/model/device.description";
import {StructureData} from "../../core/model/structure-data.capsule";
import {MenuService} from "../../core/util/menu.service";
import {FormItemType, FormModel, FormService} from "../../core/util/form.service";
import {clone} from "../../core/util/utils";
import {ReadWriteService} from "../../core/service/entity/read-write.service";

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
              private readWriteService: ReadWriteService,
              public formService: FormService) {
  }

  ngOnInit() {
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
      this.readWriteService.addOrEditEntityRead(this.entity, null, 'read', (entityRead) => {
        const c = clone(this.readCondition);
        c.reads.push(entityRead);
        if (this.updateFunction) {
          this.updateFunction(this.entity,c)
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
          this.updateFunction(this.entity,c)
        }
        this.formService.closeForm();
      }
    };
    this.formService.popupForm(fm);
  }

}
