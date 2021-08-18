import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupAddComponent } from './group-add/group-add.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
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
    component: GroupListComponent,
  },
  {
    path: 'add',
    component: GroupAddComponent,
  },
  {
    path: 'edit',
    component: GroupEditComponent,
  }
]

@NgModule({
  declarations: [GroupAddComponent, GroupListComponent, GroupEditComponent],
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
export class GroupModule { }
