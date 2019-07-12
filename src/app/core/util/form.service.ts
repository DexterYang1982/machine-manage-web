import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class FormService {
  formModel: FormModel;

  visible = true;

  constructor(private translateService: TranslateService) {
  }

  hideForm() {
    this.visible = false;
  }

  showForm() {
    this.visible = true;
  }

  popupForm(fm: FormModel) {
    if (!fm.cancelFunction) {
      fm.cancelFunction = () => {
        this.closeForm();
      };
    }
    fm.formItems.forEach(item => {
      this.valueChanged(item);
    });
    fm.formItems.forEach(fi => {
      if (fi.options) {
        fi.options.forEach(o => {
          o.label = this.translateService.instant(o.label);
        });
      }
    });
    this.formModel = fm;
  }

  closeForm() {
    this.formModel = null;
  }

  cancel() {
    if (this.formModel.cancelFunction) {
      this.formModel.cancelFunction();
    }
  }

  commit() {
    let invalid = false;
    this.formModel.formItems
      .filter(item => !item.invisible)
      .forEach(
        item => {
          if (item.required) {
            item.invalidMessage = this.checkRequiredInvalid(this.formModel.data[item.name]);
            invalid = item.invalidMessage ? true : invalid;
          }
          if (item.validations) {
            item.validations.forEach(validation => {
              if (item.invalidMessage == null) {
                item.invalidMessage = validation(item);
                invalid = item.invalidMessage ? true : invalid;
              }
            });
          }
        }
      );
    if (!invalid && this.formModel.okFunction) {
      this.formModel.okFunction();
    }
  }

  valueChanged(formItem: FormItem) {
    formItem.invalidMessage = null;
    if (formItem.onValueChanged) {
      formItem.onValueChanged(formItem);
    }
  }

  checkRequiredInvalid(value: any) {
    const message = 'This is required';
    if (value == null) {
      return message;
    }
    if (typeof value === 'string') {
      const s = value as string;
      if (s.trim().length === 0) {
        return message;
      }
    }
    if (Array.isArray(value) && value.length === 0) {
      return message;
    }
    return null;
  }
}


export interface FormModel {
  title: string;
  action?: string;
  windowWidth?: number;
  formItems?: FormItem[];
  data: any;
  okFunction?: () => void;
  cancelFunction?: () => void;
}

export interface FormItem {
  label?: string;
  name?: string;
  required?: boolean;
  invisible?: boolean;
  invalidMessage?: string;
  isDivider?: boolean;
  type?: FormItemType;
  disabled?: boolean;
  options?: FormItemOption[];
  onValueChanged?: (formItem: FormItem) => void;
  validations?: ((formItem: FormItem) => string)[];
  data?: any;
}

export interface FormItemOption {
  label: string;
  value: any;
  data?: any;
}

export enum FormItemType {
  SINGLE_TEXT,
  PASSWORD,
  MULTI_TEXT,
  SINGLE_SELECT,
  CHECK,
  INT,
  MULTI_SELECT,
  COLOR,
  CHIPS
}
