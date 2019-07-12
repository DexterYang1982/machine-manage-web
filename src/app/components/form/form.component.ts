import {Component} from '@angular/core';
import {FormService} from "../../core/util/form.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  constructor(public formService: FormService) {
  }
}
