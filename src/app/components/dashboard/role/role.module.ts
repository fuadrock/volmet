import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleAddComponent } from './role-add/role-add.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RoleListComponent } from './role-list/role-list.component';
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
import { ModalModule } from "../../../@theme/components/modal/modal.module";

const routes: Routes = [
  {
    path: '',
    component: RoleListComponent,
  },
  {
    path: 'add',
    component: RoleAddComponent,
  },
  {
    path: 'edit',
    component: RoleEditComponent,
  }
]

@NgModule({
  declarations: [RoleAddComponent, RoleEditComponent, RoleListComponent],
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
    ModalModule,
    NbSelectModule,
    NbIconModule,
    ngFormsModule,
  ]
})
export class RoleModule { }
