import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ServerEntryService} from './server-entry.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private serverEntryService: ServerEntryService,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (req.url.includes('assets/')) {
      return next.handle(req);
    }
    const serverEntry = this.serverEntryService.currentServerEntry;
    if (!serverEntry) {
      throw Error('no available server entry');
    }
    const baseUrl = 'http://' + serverEntry.ip + ':' + serverEntry.port + '/';
    const request = req.clone({
      url: baseUrl + req.url,
      headers: req.headers.set('nodeId', serverEntry.domainId).set('nodeSecret', serverEntry.domainSecret)
    });
    return next.handle(request).pipe(catchError(err => {
        if (err.status === 403) {
          this.router.navigate(['/login']);
        }
        console.log(err);
        throw parseError(err);
      }
    ));
  }
}

function parseError(error): string {
  let title = '';
  let message = '';
  if (error.status === 406) {
    const errorMessage = error.error;
    title = errorMessage.code;
    message = errorMessage.info
      + (errorMessage.ext && errorMessage.ext.length !== 0 ? ('  \"' + errorMessage.ext + '\"') : '')
      + (errorMessage.entity && errorMessage.entity.length !== 0 ? ('  \"' + errorMessage.entity + '\"') : '');
  } else {
    title = error.error ? error.error.message : error.status;
    message = error.message;
  }
  return title + ' ' + message;
}
