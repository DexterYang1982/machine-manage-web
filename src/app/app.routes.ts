import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./pages/login/login.component";
import {I18nResolve} from "./core/util/i18n.resolve";
import {ModuleWithProviders} from "@angular/core";


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    resolve: {
      i18n: I18nResolve
    }
  }
  , {path: '**', redirectTo: 'login'}
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
