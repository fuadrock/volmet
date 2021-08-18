import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes } from '@angular/router';
import { MatModule } from '../../../material-module/mat.module';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbTabsetModule,
  NbUserModule,
} from '@nebular/theme';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../@theme/theme.module';
import { ReportComponent } from './report/report.component';
import { ChartComponent } from './chart/chart.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction';
import { HolidayModalComponent } from './holiday-modal/holiday-modal.component';
import { SystemReportComponent } from './system-report/system-report.component'; // a plugin
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DatePipe } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ChartModule } from 'angular-highcharts';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

const routes: Routes = [
  {
    path: 'all',
    component: ReportComponent,
  },
  {
    path: 'chart',
    component: ChartComponent,
  },
  {
    path: 'system-report',
    component: SystemReportComponent,

  }
]

@NgModule({
  declarations: [ReportComponent, ChartComponent, HolidayModalComponent, SystemReportComponent],
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule.forChild(routes),
    MatModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    NbIconModule,
    ngFormsModule,
    FullCalendarModule,
    NbTabsetModule,
    NgxMaterialTimepickerModule,
    NgxChartsModule,
    ChartModule,

  ],
  entryComponents:[HolidayModalComponent],
  providers:[DatePipe]
})
export class ReportModule { }
