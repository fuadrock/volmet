import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { NbLayoutModule, NbInputModule, NbCheckboxModule, NbButtonModule, NbCardModule, NbMenuModule, NbListModule, NbListComponent, NbSelectModule, NbOptionModule, NbDialogService, NbTooltipModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import {  NbIconModule, NbTreeGridModule,NbDialogModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { EditModalComponent } from './home/edit-modal/edit-modal.component';
import { MatModule } from '../../material-module/mat.module';
import { FullScreenModalComponent } from './home/full-screen-modal/full-screen-modal.component';
import { ServerLogModalComponent } from './home/server-log-modal/server-log-modal.component';
import { ServerStatusComponent } from './home/server-status/server-status.component';
import { PipeModule } from '../../services/utils/pipe/pipe.module';
import { PlayerComponent } from './home/player/player.component';
import { AuthGuard } from '../../services/auth.guard';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalModule } from '../../@theme/components/modal/modal.module';
import { BnNgIdleService } from 'bn-ng-idle';
import { UserIdleModule } from 'angular-user-idle';
import { EventLogComponent } from './home/event-log/event-log.component';
import { EventLogModalComponent } from './home/event-log-modal/event-log-modal.component';
import { FullScreenDecodedTextComponent } from './home/full-screen-decoded-text/full-screen-decoded-text.component';
import {NgxPrintModule} from 'ngx-print';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "home",
        component: HomeComponent,
      },
      {
        path: "server-status",
        component: ServerStatusComponent,
      },
      {
        path: "user",
        loadChildren: () =>
          import("./user/user.module").then((m) => m.UserModule),
      },
      {
        path: "role",
        loadChildren: () =>
          import("./role/role.module").then((m) => m.RoleModule),
      },
      {
        path: "group",
        loadChildren: () =>
          import("./group/group.module").then((m) => m.GroupModule),
      },
      {
        path: "event-logging",
        loadChildren: () =>
          import("./event-logging/event-logging.module").then(
            (m) => m.EventLoggingModule
          ),
      },
      {
        path: "system-management",
        loadChildren: () =>
          import("./system-management/system-management.module").then(
            (m) => m.SystemManagementModule
          ),
      },
      {
        path: 'event-logging',

        loadChildren: () => import('./event-logging/event-logging.module')
        .then(m => m.EventLoggingModule),
      },
      {
        path: 'access-control',

        loadChildren: () => import('./access-control/access-control.module')
        .then(m => m.AccessControlModule),
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module')
        .then(m => m.ReportModule),

      },
    ],
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    PlayerComponent,
    DashboardComponent,
    EditModalComponent,
    FullScreenModalComponent,
    ServerLogModalComponent,

    ServerStatusComponent,
    EventLogComponent,
    EventLogModalComponent,
    FullScreenDecodedTextComponent,
  ],
  imports: [
    MatModule,
    ThemeModule,
    NbMenuModule,
    CommonModule,
    NbListModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    NbLayoutModule,
    NbInputModule,
    NbCheckboxModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbTreeGridModule,
    Ng2SmartTableModule,
    NbDialogModule,
    UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 100}),
    PipeModule,
    NbSelectModule,
    NbOptionModule,
    MatDialogModule,
    ModalModule,
    NbTooltipModule,
    NgxPrintModule
  ],
  entryComponents: [
    EditModalComponent,
    FullScreenModalComponent,
    ServerLogModalComponent,
    EventLogModalComponent,
    FullScreenDecodedTextComponent
  ],
  providers:[BnNgIdleService]
})
export class DashboardModule {}
