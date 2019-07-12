import {Injectable} from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';

@Injectable()
export class AlertService {

  constructor(private messageService: MessageService,
              private translateService: TranslateService,
              private confirmationService: ConfirmationService) {
  }

  message(msg: { severity: string; summary: string; detail: string; }) {
    this.messageService.add({
      severity: msg.severity,
      summary: this.translateService.instant(msg.summary),
      detail: this.translateService.instant(msg.detail)
    });
  }

  operationDone() {
    this.message({
      severity: 'success',
      summary: 'Done',
      detail: 'Operation Success'
    });
  }

  alert(message: string) {
    this.confirmationService.confirm({
      header: this.translateService.instant('Alert'),
      message: message ? this.translateService.instant(message) : message,
      rejectLabel: this.translateService.instant('Got It'),
      acceptVisible: false
    });
  }

  needToConfirm(prefix: string, content: string, confirm: () => void) {
    this.confirmationService.confirm({
      header: this.translateService.instant('Confirmation'),
      message: this.translateService.instant(prefix) + ' ' + content + ' ?',
      accept: confirm,
      acceptLabel: this.translateService.instant('Yes'),
      rejectLabel: this.translateService.instant('No'),
      acceptVisible: true
    });
  }
}
