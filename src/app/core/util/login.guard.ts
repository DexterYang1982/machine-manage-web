import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {ServerEntryService} from './server-entry.service';
import {Observable} from 'rxjs';
import {StructureDataSyncService} from "../service/structure-data-sync.service";

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private serverEntryService: ServerEntryService,
              private websocketService: StructureDataSyncService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const entryId = route.paramMap.get('entryId');
    this.serverEntryService.setCurrentServerEntry(entryId);
    if (this.serverEntryService.currentServerEntry) {
      return this.websocketService.closeCurrentAndConnect();
    } else {
      return this.router.navigate(['/login']);
    }
  }
}
