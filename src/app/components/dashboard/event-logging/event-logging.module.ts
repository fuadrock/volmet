import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventLoggingComponent } from './event-logging/event-logging.component';
import {RouterModule, Routes } from '@angular/router';
import { MatModule } from '../../../material-module/mat.module';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbTooltipModule
} from '@nebular/theme';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../@theme/theme.module';
import { EventListComponent } from './event-list/event-list.component';
import { PipeModule } from '../../../services/utils/pipe/pipe.module';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

const routes: Routes = [
  {
    path: '',
    component: EventLoggingComponent,
  },
  {
    path: 'event-list',
    component: EventListComponent,
  },

]

@NgModule({
  declarations: [EventLoggingComponent, EventListComponent],
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
    PipeModule,
    NbTooltipModule,
    NgxMaterialTimepickerModule
  ]
})
export class EventLoggingModule { }
