import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class I18nResolve implements Resolve<boolean> {
  constructor(private translateService: TranslateService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    if (this.translateService.getDefaultLang()) {
      return 1;
    } else {
      this.translateService.setDefaultLang('en');
      const browserLang = this.translateService.getBrowserLang();
      console.log('browser language ' + browserLang);
      return this.translateService.use(browserLang);
    }
  }
}
