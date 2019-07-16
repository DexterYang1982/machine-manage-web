import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {AccordionModule} from 'primeng/accordion';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {ChartModule} from 'primeng/chart';
import {CheckboxModule} from 'primeng/checkbox';
import {ChipsModule} from 'primeng/chips';
import {CodeHighlighterModule} from 'primeng/codehighlighter';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {EditorModule} from 'primeng/editor';
import {FieldsetModule} from 'primeng/fieldset';
import {FileUploadModule} from 'primeng/fileupload';
import {GalleriaModule} from 'primeng/galleria';
import {GrowlModule} from 'primeng/growl';
import {InplaceModule} from 'primeng/inplace';
import {InputMaskModule} from 'primeng/inputmask';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {LightboxModule} from 'primeng/lightbox';
import {ListboxModule} from 'primeng/listbox';
import {MegaMenuModule} from 'primeng/megamenu';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MultiSelectModule} from 'primeng/multiselect';
import {OrderListModule} from 'primeng/orderlist';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {PaginatorModule} from 'primeng/paginator';
import {PanelModule} from 'primeng/panel';
import {PanelMenuModule} from 'primeng/panelmenu';
import {PasswordModule} from 'primeng/password';
import {PickListModule} from 'primeng/picklist';
import {ProgressBarModule} from 'primeng/progressbar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RatingModule} from 'primeng/rating';
import {ScheduleModule} from 'primeng/schedule';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SlideMenuModule} from 'primeng/slidemenu';
import {SliderModule} from 'primeng/slider';
import {SpinnerModule} from 'primeng/spinner';
import {SplitButtonModule} from 'primeng/splitbutton';
import {StepsModule} from 'primeng/steps';
import {TabMenuModule} from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {TerminalModule} from 'primeng/terminal';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {ToastModule} from 'primeng/toast';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {TreeModule} from 'primeng/tree';
import {TreeTableModule} from 'primeng/treetable';
import {NgxWebstorageModule} from 'ngx-webstorage';
////////////
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {AlertService} from "./core/util/alert.service";
import {I18nResolve} from "./core/util/i18n.resolve";
import {HttpService} from "./core/util/http.service";
import {MenuService} from "./core/util/menu.service";
import {AppRoutes} from "./app.routes";
import {ServerEntryService} from "./core/util/server-entry.service";
import {FormService} from "./core/util/form.service";
import {FormItemComponent} from "./components/form-item/form-item.component";
import {FormComponent} from "./components/form/form.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FrameComponent} from './pages/main/frame/frame.component';
import {AppFooterComponent} from "./pages/main/frame/app.footer.component";
import {AppTopbarComponent} from "./pages/main/frame/app.topbar.component";
import {AppSidebartabcontentComponent} from "./pages/main/frame/app.sidebartabcontent.component";
import {AppSideBarComponent} from "./pages/main/frame/app.sidebar.component";
import {EntityClassComponent} from "./pages/main/entity-class/entity-class.component";
import {StructureDataSyncService} from "./core/service/structure-data-sync.service";
import {LoginGuard} from "./core/util/login.guard";
import {CustomFieldService} from "./core/service/entityField/custom-field.service";
import {EmbeddedFieldService} from "./core/service/entityField/embedded-field.service";
import {ModbusUnitClassService} from "./core/service/entityClass/modbus-unit-class.service";
import {MachineClassService} from "./core/service/entityClass/machine-class.service";
import {ModbusSlaveClassService} from "./core/service/entityClass/modbus-slave-class.service";
import {GroupClassService} from "./core/service/entityClass/group-class.service";
import {DisplayClassService} from "./core/service/entityClass/display-class.service";
import {CabinClassService} from "./core/service/entityClass/cabin-class.service";
import {DeviceClassService} from "./core/service/entityClass/device-class.service";
import {TunnelClassService} from "./core/service/entityClass/tunnel-class.service";
import {RequestInterceptor} from "./core/util/request.interceptor";

////////////


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    AppSideBarComponent,
    AppSidebartabcontentComponent,
    AppTopbarComponent,
    AppFooterComponent,
    FrameComponent,
    LoginComponent,
    FormItemComponent,
    FormComponent,
    EntityClassComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutes,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ColorPickerModule,
    ContextMenuModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GrowlModule,
    InplaceModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    ScrollPanelModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    NgxWebstorageModule.forRoot()
  ],
  providers: [
    LoginGuard,
    StructureDataSyncService,
    ConfirmationService,
    MessageService,
    ServerEntryService,
    FormService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    AlertService,
    I18nResolve,
    HttpService,
    MenuService,
    CustomFieldService,
    EmbeddedFieldService,
    MachineClassService,
    ModbusSlaveClassService,
    ModbusUnitClassService,
    GroupClassService,
    DisplayClassService,
    CabinClassService,
    DeviceClassService,
    TunnelClassService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
