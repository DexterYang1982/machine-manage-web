import {Component, Input} from '@angular/core';
import {FormItem, FormItemType, FormService} from "../../core/util/form.service";

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.css']
})
export class FormItemComponent {
  formItemType = FormItemType;

  constructor(public formService: FormService) {
  }

  @Input()
  item: FormItem;

  keyPress(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.formService.commit();
    }
  }
}
