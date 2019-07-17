import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./pages/login/login.component";
import {I18nResolve} from "./core/util/i18n.resolve";
import {ModuleWithProviders} from "@angular/core";
import {FrameComponent} from "./pages/main/frame/frame.component";
import {EntityClassComponent} from "./pages/main/entity-class/entity-class.component";
import {LoginGuard} from "./core/util/login.guard";
import {MachineConfigComponent} from "./pages/main/machine-config/machine-config.component";


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    resolve: {
      i18n: I18nResolve
    }
  },
  {
    path: 'main/:entryId',
    component: FrameComponent,
    canActivate: [LoginGuard],
    resolve: {
      i18n: I18nResolve
    },
    children: [
      {path: '', component: EntityClassComponent},
      {path: 'entityClass/', component: EntityClassComponent},
      {path: 'entityClass/:dataName', component: EntityClassComponent},
      {path: 'machine/', component: MachineConfigComponent},
      {path: 'machine/:id', component: MachineConfigComponent}
    ],
  }
  , {path: '**', redirectTo: 'login'}
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
