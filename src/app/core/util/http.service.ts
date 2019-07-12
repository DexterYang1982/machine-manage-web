import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertService} from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient,
              private alertService: AlertService) {
  }

  http<T>(url: string[], params: any, body: any, callBack: (t) => void) {
    this.httpClient.request<T>(
      url[0],
      url[1],
      {
        params,
        body
      }).subscribe(t => callBack(t),
      error => {
        this.alertService.alert(error);
      });
  }
}
