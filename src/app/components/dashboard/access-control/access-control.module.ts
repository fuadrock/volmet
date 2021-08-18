import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlAddComponent } from './access-control-add/access-control-add.component';
import { AccessControlListComponent } from './access-control-list/access-control-list.component';
import { AccessControlEditComponent } from './access-control-edit/access-control-edit.component';
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
} from '@nebular/theme';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../@theme/theme.module';

const routes: Routes = [
  {
    path: '',
    component: AccessControlListComponent,
  },
  {
    path: 'add',
    component: AccessControlAddComponent,
  },
  {
    path: 'edit',
    component: AccessControlEditComponent,
  }
]

@NgModule({
  declarations: [AccessControlAddComponent, AccessControlListComponent, AccessControlEditComponent],
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
  ]
})
export class AccessControlModule { }
